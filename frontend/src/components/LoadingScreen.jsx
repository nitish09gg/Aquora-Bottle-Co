import * as LottiePackage from "lottie-react";
import whaleAnimation from "../assets/blue.json";
import { useAuth } from "../context/AuthContext";

const Lottie =
  LottiePackage.default?.default ||
  LottiePackage.default;

function LoadingScreen() {
  const { loadingConfig } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 via-cyan-100 to-white">
      <div className="w-80">
        <Lottie
          animationData={whaleAnimation}
          loop
          autoplay
        />
      </div>

      <h2 className="mt-6 text-3xl font-bold text-sky-800">
        {loadingConfig.title}
      </h2>

      <p className="mt-2 text-lg text-slate-600">
        {loadingConfig.message}
      </p>
    </div>
  );
}

export default LoadingScreen;