import { useState } from "react";
import { useJwt } from "../../context/JWTContext";
import { jwtDecode } from "jwt-decode";
import { EyeOff, Eye } from "lucide-react";
export default function JwtTokenInput() {
  const { token, setToken } = useJwt();

  let decoded = null;
  let isExpired = false;

  try {
    decoded = jwtDecode(token);
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      isExpired = true;
    }
  } catch {}
  const [showJwt, setShowJwt] = useState(false);
  return (
    <div className="bg-[var(--nav-bg)] text-[var(--text-color)] w-full max-w-xl shadow-md p-5 rounded-xl space-y-3 border">
      <label className="block text-sm font-medium text-[var(--text-color)]">
        JWT Auth Token
      </label>

      <div className="relative">
        <input
          type={showJwt ? "text" : "password"}
          className="w-full flex-grow p-2 border rounded bg-[var(--input-bg)] border-[var(--accent-color)] text-[var(--text-color)]"
          placeholder="Paste your JWT here..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowJwt(!showJwt)}
          className="absolute text-[var(--eye-bg)] inset-y-0 right-0 flex items-center px-3 cursor-pointer"
        >
          {showJwt ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {token && (
        <div className="flex justify-between items-start text-xs text-gray-600 mt-2">
          <div>
            {isExpired ? (
              <span className="text-red-500 font-medium">
                This Token is Expired
              </span>
            ) : (
              <span className="text-green-500 font-medium">
                This Token is Valid
              </span>
            )}
            {decoded?.exp && (
              <div className="mt-1">
                Exp: {new Date(decoded.exp * 1000).toLocaleString()}
              </div>
            )}
          </div>
          <button
            onClick={() => setToken("")}
            className="text-red-500 underline text-xs font-semibold"
          >
            Clear Token
          </button>
        </div>
      )}
    </div>
  );
}
