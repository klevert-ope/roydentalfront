const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh]">
      <h1>Unauthorized</h1>
      <p className={"text-red-700"}>
        You do not have permission to access this page.
      </p>
    </div>
  );
};

export default Unauthorized;
