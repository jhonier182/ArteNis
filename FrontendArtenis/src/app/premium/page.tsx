"use client";
import Link from 'next/link';

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/fondo.jpg)' }}>
      <div className="min-h-screen bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 text-white shadow-2xl overflow-hidden">
          <div className="p-6">
            <button className="text-white/80">✕</button>
          </div>
          <div className="px-6 -mt-8">
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden ring-2 ring-white/50">
              <img src="/fondo.jpg" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-semibold text-center mt-4">Upgrade to Premium</h1>
            <ul className="mt-4 space-y-3 text-white/90">
              <li>✅ Unlimited AI Generations</li>
              <li>✅ Generate High Quality Images</li>
              <li>✅ Ads Free</li>
              <li>✅ Unlimited Storage</li>
            </ul>

            {/* Plans */}
            <div className="mt-6 space-y-3">
              <label className="flex items-center justify-between rounded-xl bg-white/10 border border-white/30 px-4 py-3">
                <div>
                  <div className="font-medium">Professional</div>
                  <div className="text-xs text-white/80">7-Days Free Trial</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">$29</div>
                  <div className="text-xs text-white/80">/Month</div>
                </div>
              </label>
              <label className="flex items-center justify-between rounded-xl bg-white/5 border border-white/20 px-4 py-3">
                <div>
                  <div className="font-medium">Team</div>
                  <div className="text-xs text-white/80">14-Days Free Trial</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">$99</div>
                  <div className="text-xs text-white/80">/Month</div>
                </div>
              </label>
            </div>

            <button className="w-full mt-6 rounded-full bg-violet-600 hover:bg-violet-500 py-3 font-medium">Continue For Payment</button>

            <div className="text-center text-xs text-white/70 mt-4">
              <Link href="#" className="underline">Terms of use</Link> · <Link href="#" className="underline">Privacy Policy</Link> · <Link href="#" className="underline">Restore</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


