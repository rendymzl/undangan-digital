import { Textarea } from "../../components/ui/textarea";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { InvitationFormData } from "@/utils/data-transform";

type Props = {
  form: InvitationFormData;
  updateForm: (path: string, value: any) => void;
};

const CeritaCintaStep: React.FC<Props> = ({ form, updateForm }) => (
  // --- Dibungkus dengan Card agar konsisten ---
  <Card>
    <CardHeader>
      <CardTitle>Cerita Cinta (Opsional)</CardTitle>
      <CardDescription>
        Bagikan kisah perjalanan cinta Anda bersama pasangan.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Label htmlFor="cerita-cinta" className="sr-only">
        Cerita Cinta
      </Label>
      <Textarea
        id="cerita-cinta"
        value={form.ceritaCinta || ''}
        onChange={e => updateForm("ceritaCinta", e.target.value)}
        placeholder="Tulis kisah cinta kalian di sini, misal: bagaimana bertemu, perjalanan cinta, atau momen spesial lainnya..."
        rows={10}
        className="resize-none"
      />
    </CardContent>
  </Card>
);

export default CeritaCintaStep;