// app/(dashboard)/referencia-detalle/[collectionId]/[referenciaId]/fases/[fasesSlug]/page.tsx

import { getFaseData } from '@/app/globals/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/globals/components/ui/tabs";

interface ReferenciaFasePageProps {
  params: {
    collectionId: string;
    referenciaId: string;
    fasesSlug: string;
  };
}

export default async function ReferenciaFasePage({ params }: ReferenciaFasePageProps) {
  const { collectionId, referenciaId, fasesSlug } = params;
  const faseData = await getFaseData(referenciaId, fasesSlug, collectionId);

  if (!faseData) {
    return <div className="p-4">Error al cargar los datos de la fase.</div>;
  }

  if (fasesSlug === 'md-creacion-ficha') {
    return (
      <div className="p-4">
        <Tabs defaultValue="telas">
          <TabsList>
            <TabsTrigger value="telas">Telas</TabsTrigger>
            <TabsTrigger value="insumos">Insumos</TabsTrigger>
          </TabsList>
          <TabsContent value="telas">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">Referencia</th>
                    <th className="py-2 px-4 border-b">Nombre de Línea</th>
                    <th className="py-2 px-4 border-b">Código de Artículo</th>
                    <th className="py-2 px-4 border-b">Nombre de Artículo</th>
                    <th className="py-2 px-4 border-b">Ancho</th>
                  </tr>
                </thead>
                <tbody>
                  {faseData.telas && faseData.telas.map((tela: any, index: number) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{tela.U_GSP_REFERENCE}</td>
                      <td className="py-2 px-4 border-b">{tela.U_GSP_SchLinName}</td>
                      <td className="py-2 px-4 border-b">{tela.U_GSP_ItemCode}</td>
                      <td className="py-2 px-4 border-b">{tela.U_GSP_ItemName}</td>
                      <td className="py-2 px-4 border-b">{tela.BWidth1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="insumos">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">Referencia</th>
                    <th className="py-2 px-4 border-b">Nombre de Línea</th>
                    <th className="py-2 px-4 border-b">Código de Artículo</th>
                    <th className="py-2 px-4 border-b">Nombre de Artículo</th>
                    <th className="py-2 px-4 border-b">Ancho</th>
                  </tr>
                </thead>
                <tbody>
                  {faseData.insumos && faseData.insumos.map((insumo: any, index: number) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{insumo.U_GSP_REFERENCE}</td>
                      <td className="py-2 px-4 border-b">{insumo.U_GSP_SchLinName}</td>
                      <td className="py-2 px-4 border-b">{insumo.U_GSP_ItemCode}</td>
                      <td className="py-2 px-4 border-b">{insumo.U_GSP_ItemName}</td>
                      <td className="py-2 px-4 border-b">{insumo.BWidth1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{faseData.nombre_fase || fasesSlug}</h1>
      <p>{faseData.mensaje}</p>
    </div>
  );
}
