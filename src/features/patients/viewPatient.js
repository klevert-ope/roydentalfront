import React from "react";
import Link from "next/link";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";

const ViewPatient = ({ patientId }) => {
  return (
    <Link
      href={`/patients/${patientId}`}
      title="View Patient details"
      prefetch={true}
    >
      <Button variant="ghost" size="icon">
        <Ellipsis color={"var(--primary)"} />
      </Button>
    </Link>
  );
};

export const ActionsCell = ({ row }) => {
  return <ViewPatient patientId={row.original.id} />;
};
