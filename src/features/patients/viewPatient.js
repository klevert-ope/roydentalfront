import {Button} from "@/components/ui/button";
import {Ellipsis} from "lucide-react";
import Link from "next/link";
import React from "react";

const ViewPatient = ({ patientId }) => {
  return (
    <Link
      href={`/patients/${patientId}`}
      title="View Patient details"
      prefetch={true}
    >
      <Button variant="ghost" size="icon">
        <Ellipsis/>
      </Button>
    </Link>
  );
};

export const ActionsCell = ({ row }) => {
  return <ViewPatient patientId={row.original.id} />;
};
