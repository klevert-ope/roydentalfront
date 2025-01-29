"use client";
import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {useGetPatientByID} from "@/hooks/usePatients";
import {useParams} from "next/navigation";
import React from "react";

export default function PatientDetails() {
    const {patientId} = useParams();
    const {data = []} = useGetPatientByID(patientId);

  return (
      <Card>
          <CardContent>
              <Bio patient={data}/>
              <Separator/>
              <InsuranceInfo patient={data}/>
              <Separator/>
              <ContactInfo patient={data}/>
          </CardContent>
      </Card>
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
    <div className="w-full py-4">
        <div className="flex flex-row justify-between">
            <h4 className="underline">ID {patient.id}</h4>
            <h4 className="underline">
                Created
                On {new Date(patient.created_at).toLocaleString("en-KE", {
                timeZone: "Africa/Nairobi",
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
            })}
            </h4>
        </div>
        <h3>BIO DATA</h3>
        <div className="flex flex-row flex-wrap justify-between">
      <InfoField
        label="Name"
        value={`${patient.first_name} ${
          patient.middle_name || ""
        } ${patient.last_name}`}
      />
      <InfoField label="Sex" value={patient.sex} />
      <InfoField
          label="DOB"
        value={new Date(patient.date_of_birth).toLocaleDateString("en-KE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      />
        </div>
    </div>
);

// InsuranceInfo Component
const InsuranceInfo = ({ patient }) => (
    <div className="w-full py-4 mt-4">
        <h3>BILLING INFO</h3>
        <div className="flex flex-row flex-wrap justify-between">
      <InfoField label="Insured" value={patient.insured ? "Yes" : "No"} />
      <InfoField label="Cash" value={patient.cash ? "Yes" : "No"} />
      {patient.insurance_company && (
        <InfoField
          label="Insurance Company"
          value={patient.insurance_company}
        />
      )}
            {patient.scheme &&
                <InfoField label="Scheme" value={patient.scheme}/>}
      {patient.cover_limit !== undefined && (
        <InfoField label="Cover Limit" value={`KES ${patient.cover_limit}`} />
      )}
      {patient.occupation && (
        <InfoField label="Occupation" value={patient.occupation} />
      )}
      {patient.place_of_work && (
        <InfoField label="Place of Work" value={patient.place_of_work} />
      )}
        </div>
    </div>
);

// ContactInfo Component
const ContactInfo = ({ patient }) => (
    <div className="w-full py-4 mt-4">
        <h3>CONTACT INFO</h3>
        <div className="flex flex-row flex-wrap justify-between">
      <InfoField label="Phone" value={patient.phone} />
            {patient.email &&
                <InfoField label="Email" value={patient.email}/>}
            {patient.address &&
                <InfoField label="Address" value={patient.address}/>}
        </div>
    </div>
);
