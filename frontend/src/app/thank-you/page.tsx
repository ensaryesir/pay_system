import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teşekkürler | Uluslararası Kültür ve Turizm Derneği",
  description: "Bağışınız için teşekkür ederiz. Desteğiniz kültürel mirasın korunması ve sürdürülebilir turizm projelerine katkı sağlayacaktır.",
  keywords: [
    "bağış teşekkür", 
    "kültür derneği bağış", 
    "turizm derneği destek", 
    "bağış onay"
  ],
  openGraph: {
    type: "website",
    url: "https://ornekdernek.com/thank-you",
    title: "Bağışınız İçin Teşekkürler | Uluslararası Kültür ve Turizm Derneği",
    description: "Desteğiniz kültürel mirasın korunması ve sürdürülebilir turizm projelerine katkı sağlayacaktır.",
  },
};

const ThankYouPage = () => {
  return (
    <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[600px] rounded-md bg-white px-6 py-14 text-center shadow-md dark:bg-dark sm:px-12 md:px-[60px]">
              <div className="mb-8 flex justify-center">
                <svg
                  className="h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Bağışınız İçin Teşekkür Ederiz!
              </h2>
              <p className="mb-6 text-base font-medium text-body-color dark:text-body-color-dark">
                Değerli katkınız, kültürel mirasın korunması ve sürdürülebilir turizm projelerine destek olacaktır. Bağışınızın onayı e-posta adresinize gönderilmiştir.
              </p>
              <p className="mb-10 text-base font-medium text-body-color dark:text-body-color-dark">
                Bağış makbuzunuz en kısa sürede e-posta adresinize iletilecektir.
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link
                  href="/"
                  className="rounded-sm bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                >
                  Ana Sayfaya Dön
                </Link>
                <Link
                  href="/blog"
                  className="inline-block rounded-sm bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-black/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  Haberlerimizi İncele
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-0 z-[-1]">
        <svg
          width="1440"
          height="969"
          viewBox="0 0 1440 969"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_95:1005"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1440"
            height="969"
          >
            <rect width="1440" height="969" fill="#090E34" />
          </mask>
          <g mask="url(#mask0_95:1005)">
            <path
              opacity="0.1"
              d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
              fill="url(#paint0_linear_95:1005)"
            />
            <path
              opacity="0.1"
              d="M1324.5 755.5L1450 687L1392 788.5L1324.5 755.5Z"
              fill="url(#paint1_linear_95:1005)"
            />
            <path
              opacity="0.1"
              d="M-188.5 -112.5L-112 -4.5L-134.5 4L-188.5 -112.5Z"
              fill="url(#paint2_linear_95:1005)"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_95:1005"
              x1="1178.4"
              y1="151.853"
              x2="780.959"
              y2="453.581"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_95:1005"
              x1="1367.33"
              y1="688.211"
              x2="1439.89"
              y2="802.638"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_95:1005"
              x1="-176.5"
              y1="-125.5"
              x2="-92.4999"
              y2="54.0001"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default ThankYouPage; 