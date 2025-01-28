"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {useGetPatientByID} from "@/hooks/usePatients";
import {useParams} from "next/navigation";
import React from "react";

export default function PatientDetails() {
    const {patientId} = useParams();
    const {data = []} = useGetPatientByID(patientId);

  return (
    <div>
      <Bio patient={data} />
      <InsuranceInfo patient={data} />
      <ContactInfo patient={data} />
    </div>
  );
}

const InfoField = ({ label, value }) => (
  <div className="p-2">
    <Label className="text-base font-semibold">{label}</Label>
    <p>{value}</p>
  </div>
);

// Bio Component
const Bio = ({ patient }) => (
  <Card className="w-full py-4">
    <CardHeader>
      <CardTitle>Bio</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <InfoField label="ID" value={patient.id} />
      <InfoField
        label="Name"
        value={`${patient.first_name} ${
          patient.middle_name || ""
        } ${patient.last_name}`}
      />
      <InfoField label="Sex" value={patient.sex} />
      <InfoField
        label="Date of Birth"
        value={new Date(patient.date_of_birth).toLocaleDateString("en-KE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      />
      <InfoField
        label="Created At"
        value={new Date(patient.created_at).toLocaleString("en-KE", {
          timeZone: "Africa/Nairobi",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      />
    </CardContent>
  </Card>
);

// InsuranceInfo Component
const InsuranceInfo = ({ patient }) => (
  <Card className="w-full py-4 mt-4">
    <CardHeader>
      <CardTitle>Billing Info</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <InfoField label="Insured" value={patient.insured ? "Yes" : "No"} />
      <InfoField label="Cash" value={patient.cash ? "Yes" : "No"} />
      {patient.insurance_company && (
        <InfoField
          label="Insurance Company"
          value={patient.insurance_company}
        />
      )}
      {patient.scheme && <InfoField label="Scheme" value={patient.scheme} />}
      {patient.cover_limit !== undefined && (
        <InfoField label="Cover Limit" value={`KES ${patient.cover_limit}`} />
      )}
      {patient.occupation && (
        <InfoField label="Occupation" value={patient.occupation} />
      )}
      {patient.place_of_work && (
        <InfoField label="Place of Work" value={patient.place_of_work} />
      )}
    </CardContent>
  </Card>
);

// ContactInfo Component
const ContactInfo = ({ patient }) => (
  <Card className="w-full py-4 mt-4">
    <CardHeader>
      <CardTitle>Contact Info</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <InfoField label="Phone" value={patient.phone} />
      {patient.email && <InfoField label="Email" value={patient.email} />}
      {patient.address && <InfoField label="Address" value={patient.address} />}
    </CardContent>
  </Card>
);
