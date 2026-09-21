import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  Zap,
  Wind,
  Tv,
  Hammer,
  Paintbrush,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { getCategories } from '@/lib/actions/categories';
import { Button } from '@/components/ui/Button';

export default async function ServicesPage() {
  const res = await getCategories();
  const categories = res.data || [];

  const categoryIconMap: Record<string, any> = {
    plumbing: Wrench,
    electrical: Zap,
    'ac-repair': Wind,
    'appliance-repair': Tv,
    carpentry: Hammer,
    painting: Paintbrush,
    cleaning: Sparkles,
    handyman: Hammer,
  };

  const serviceHighlights: Record<string, { typical: string[]; avgStarting: string }> = {
    plumbing: {
      typical: ['Burst pipe emergency repair', 'Sanitary bathroom fixture installation', 'Water tank & pump plumbing', 'Drain unclogging'],
      avgStarting: 'Rs. 500',
    },
    electrical: {
      typical: ['Short-circuit & MCB trip fixing', 'House rewiring & DB box balancing', 'Solar inverter & battery setup', 'LED & smart switchboards'],
      avgStarting: 'Rs. 600',
    },
    'ac-repair': {
      typical: ['High-pressure water jet AC cleaning', 'R32 / R410A refrigerant gas top-up', 'Split AC installation & relocation', 'Compressor troubleshooting'],
      avgStarting: 'Rs. 1,000',
    },
    'appliance-repair': {
      typical: ['Washing machine spinning / drain repair', 'Refrigerator thermostat & cooling repair', 'Microwave oven magnetron fixes', 'RO water purifier filter change'],
      avgStarting: 'Rs. 700',
    },
    carpentry: {
      typical: ['Modular kitchen soft-close hinge repair', 'Main door mortise lock & cylinder fitting', 'Custom wooden wardrobes & shelves', 'Laminate flooring setup'],
      avgStarting: 'Rs. 800',
    },
    painting: {
      typical: ['Interior luxury emulsion wall paint', 'Damp wall polymer waterproofing', 'Exterior weather-coat painting', 'Drywall putty & sanding'],
      avgStarting: 'Rs. 1,500',
    },
    cleaning: {
      typical: ['Full 2BHK / 3BHK deep home cleaning', 'Sofa steam foam shampooing', 'Kitchen chimney de-greasing', 'Water tank sterilization'],
      avgStarting: 'Rs. 1,200',
    },
    handyman: {
      typical: ['LED/OLED TV wall bracket mounting', 'Curtain rod & blind drilling', 'Heavy wall mirror & shelf hanging', 'Door handle & lock replacement'],
      avgStarting: 'Rs. 400',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Platform Service Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            All Home Repair & Maintenance Services
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Discover specialized CTEVT-certified technicians across 8 core household and commercial trade categories in Nepal.
          </p>
        </div>

        {/* Categories Detailed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => {
            const Icon = categoryIconMap[cat.slug] || Wrench;
            const meta = serviceHighlights[cat.slug] || {
              typical: ['Inspection & Diagnosis', 'Standard Repairs', 'New Installation'],
              avgStarting: 'Rs. 500',
            };

            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{cat.name}</h2>
                        <span className="text-xs font-semibold text-slate-400">
                          {cat._count?.technicians || 0} active specialists
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Avg Starting
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        {meta.avgStarting}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {cat.description}
                  </p>

                  <div className="space-y-2 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 block mb-1">
                      Common Services in this Category:
                    </span>
                    {meta.typical.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Background verified pros
                  </span>
                  <Link href={`/technicians?category=${cat.slug}`}>
                    <Button variant="primary" size="sm">
                      Find {cat.name} Pros <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
