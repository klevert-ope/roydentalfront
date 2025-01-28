import {Loader2} from "lucide-react";
import React from "react";

export const LoadingPage = () => {
  return (
	  <div className="flex items-center justify-center my-32">
      <Loader2 className="motion-safe:animate-spin" color={"var(--primary)"} />
      <span className={"ml-2 text-[var(--primary)]"}>Please wait</span>
    </div>
  );
};

export const LoadingForm = () => {
  return (
    <div className="flex items-center justify-center  my-4">
      <Loader2 className="motion-safe:animate-spin" color={"var(--primary)"} />
      <span className={"ml-2 text-[var(--primary)]"}>Please wait</span>
    </div>
  );
};
