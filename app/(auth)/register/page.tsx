import { RegisterForm } from "../components/register-form";

export default function RegisterPage() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="space-y-6">
        <h1 className="text-center text-2xl font-medium leading-none tracking-tight">
          Register
        </h1>
        <div className="w-96 p-4 border border-border rounded-xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
