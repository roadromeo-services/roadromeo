import { bikeBrands } from '@/data/bikes';

export const BrandsServed = () => {
  return (
    <section className="section-padding bg-mesh overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-24">
          <span className="badge-premium">Versatility</span>
          <h2 className="section-heading tracking-tighter">Brands We Expertly Service</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            From daily commuters to super-bikes, our technicians are trained to handle
            the specific engineering of every major manufacturer.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {bikeBrands.map((brand) => (
            <div
              key={brand.id}
              className="group relative flex flex-col items-center"
            >
              <div className="relative w-full aspect-square bg-white rounded-[2.5rem] p-8 flex items-center justify-center shadow-premium border border-slate-50 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 w-full h-full flex items-center justify-center transition-all duration-500 group-hover:scale-125">
                  {brand.logo ? (
                    <brand.logo className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-4xl font-black text-primary transition-colors">
                      {brand.name.charAt(0)}
                    </span>
                  )}
                </div>
              </div>

              {/* <span className="mt-4 text-sm font-bold text-slate-400 group-hover:text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                {brand.name}
              </span> */}
            </div>
          ))}
        </div>

        <div className="mt-24 p-10 md:p-16 bg-slate-900 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          {/* Decorative pattern for the CTA card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left">
              <h4 className="text-3xl md:text-4xl font-black text-white mb-4">Don't see your brand?</h4>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl">
                Our expertise covers almost every bike on the road. If it's on two wheels, we can likely fix it.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <a
                href="tel:9730963184"
                className="bg-primary text-white px-12 py-5 rounded-2xl font-black hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-primary/20 hover:shadow-white/10 active:scale-95 text-center whitespace-nowrap"
              >
                Ask Our Experts
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
