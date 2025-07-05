"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface CandidateData {
  candidat: string;
  score: number;
  date: string;
  email: string;
  phone: string;
  final_decision: string;
}

export default function Page() {
  const columnDefs: ColDef[] = [
    { field: "candidat" },
    { field: "score" },
    { field: "date" },
    { field: "email" },
    { field: "phone" },
    { field: "final_decision" },
  ];
  type Card = {
    title: string;
    number: number;
    tag: number;
    description_tag: string;
    description: string;
  };

  const [datas, setDatas] = useState<CandidateData[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchToken = async () => {
      const datas = await getData();
      setDatas(datas);
    };
    formatCardData().then((data) => {
      setCards(data);
    });

    fetchToken();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards cards={cards} />
              <div className="w-full h-[35vw] max-h-[600px] flex items-center justify-center overflow-auto px-6 sm:h-[500px] md:h-[600px] lg:h-[700px]">
                <div className="w-full h-full">
                  <AgGridReact
                    className="w-full h-full"
                    rowData={datas}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={12}
                    paginationPageSizeSelector={[12, 20, 50, 100]}
                    domLayout="normal"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

async function getToken() {
  const params: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "password",
      username: "stage@rocket4sales.com",
      password: "stagestage",
    }),
  };
  const url: string = API_BASE_URL + "token";
  try {
    const rep: Response = await fetch(url, params);

    if (!rep.ok) {
      throw new Error("Erreur OK dans la requête getToken");
    }
    return await rep.json();
  } catch (error) {
    throw new Error("Erreur dans la requête getToken" + error);
  }
}

async function getData() {
  const token = await getToken();

  const params = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token["access_token"],
    },
  };
  const url: string =
    API_BASE_URL +
    "cv_analyzer_2?deal_id=1&accepted=false&all=false&archived=true";
  try {
    const rep: Response = await fetch(url, params);

    if (!rep.ok) {
      throw new Error("Erreur OK dans la requête getData");
    }

    const data = await rep.json();
    return data["data"];
  } catch (error) {
    throw new Error("catch error getData" + error);
  }
}
interface Candidat {
  id: number;
  candidat: string;
  final_decision: string;
  date: string;
  campaign_name: string;
}

async function formatCardData() {
  const data: Candidat[] = await getData();

  // Calculer les totaux par décision
  const totalAccepted = data.filter(
    (item: Candidat) => item.final_decision === "Green"
  ).length;
  const totalPending = data.filter(
    (item: Candidat) => item.final_decision === "Yellow"
  ).length;

  // Obtenir les deux dernières dates uniques
  const uniqueDates = [
    ...new Set(data.map((item: Candidat) => item.date)),
  ].sort();
  const lastDate = uniqueDates[uniqueDates.length - 1];
  const secondLastDate = uniqueDates[uniqueDates.length - 2];

  // Calculer les taux d'augmentation
  const calculateGrowthRate = (
    currentCount: number,
    previousCount: number
  ): number => {
    if (previousCount === 0) return currentCount > 0 ? 100 : 0;
    return Math.round(((currentCount - previousCount) / previousCount) * 100);
  };

  // Données pour la dernière date
  const lastDateData = data.filter((item: Candidat) => item.date === lastDate);
  const secondLastDateData = data.filter(
    (item: Candidat) => item.date === secondLastDate
  );

  // Calculs des taux d'augmentation
  const totalCvGrowth = calculateGrowthRate(
    lastDateData.length,
    secondLastDateData.length
  );

  const lastDateAccepted = lastDateData.filter(
    (item: Candidat) => item.final_decision === "Green"
  ).length;
  const secondLastDateAccepted = secondLastDateData.filter(
    (item: Candidat) => item.final_decision === "Green"
  ).length;
  const acceptedGrowth = calculateGrowthRate(
    lastDateAccepted,
    secondLastDateAccepted
  );

  const lastDatePending = lastDateData.filter(
    (item: Candidat) => item.final_decision === "Yellow"
  ).length;
  const secondLastDatePending = secondLastDateData.filter(
    (item: Candidat) => item.final_decision === "Yellow"
  ).length;
  const pendingGrowth = calculateGrowthRate(
    lastDatePending,
    secondLastDatePending
  );

  return [
    {
      title: "Total CV",
      number: data.length,
      tag: totalCvGrowth,
      description_tag: `Évolution depuis ${secondLastDate}`,
      description: "CV analysés au total",
    },
    {
      title: "Total Accepted",
      number: totalAccepted,
      tag: acceptedGrowth,
      description_tag: `Évolution depuis ${secondLastDate}`,
      description: "CV acceptés (Green)",
    },
    {
      title: "Total Pending",
      number: totalPending,
      tag: pendingGrowth,
      description_tag: `Évolution depuis ${secondLastDate}`,
      description: "CV en attente (Yellow)",
    },
  ];
}
