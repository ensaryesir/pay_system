import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <>
      <section id="features" className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="Derneğimizin Öne Çıkan Özellikleri"
            paragraph="Kültür turizmini daha erişilebilir, sürdürülebilir ve anlamlı hale getirmek için çalışıyoruz. İşte bizi farklı kılan özellikler:"
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <div
                key={feature.id}
                className="feature-card transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              >
                <SingleFeature feature={feature} />
                {/* Statistics and the CTA Button */}
                <div className="mt-4 flex flex-col space-y-2 px-6 pb-6">
                  {/* Statistics */}
                  {feature.stats && (
                    <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      {feature.stats.map((stat, index) => (
                        <span key={index}>{stat}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;