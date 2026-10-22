import {
  ShieldCheck,
  CheckCircle2,
  Building2
} from 'lucide-react';

export const roleShowcaseData = {
  retailer: {
    roleName: 'Retailer (Buyer)',
    badgeText: 'For Independent Retailers & Kirana Stores',
    headline: 'Source Directly from Local Mills at Verified Mandi Rates.',
    subheadline:
      'Join 1,200+ Kirana and supermarket owners sourcing commodities with live mill prices, atomic stock locks, and consolidated split-cart doorstep delivery.',
    statValue: '₹18,400',
    statLabel: 'Avg. Monthly Savings on Procurement',
    features: [
      {
        id: 'feat-1',
        icon: ShieldCheck,
        title: 'GSTIN Verified Business Network',
        description:
          'Every mill and distributor is physically vetted with active GSTIN and APMC mandi licensing for zero counterfeit risk.'
      },
      {
        id: 'feat-2',
        icon: CheckCircle2,
        title: 'Automated MOQ & MOV Validation',
        description:
          'Transparent minimum order thresholds and tiered volume slabs ensure immediate order confirmation with zero phone haggling.'
      },
      {
        id: 'feat-3',
        icon: Building2,
        title: 'Direct Mill & Store Price Discovery',
        description:
          'Bypass speculative brokers. Access real-time mandi benchmarks and locked stock counts directly from regional millers.'
      }
    ],
    trustQuote:
      'Joined by 1,200+ local retailers & wholesale suppliers in Mumbai & Bangalore.'
  },
  wholesaler: {
    roleName: 'Wholesaler (Seller)',
    badgeText: 'For Commodity Mills, Stockists & Distributors',
    headline: 'Automate Bulk Orders & Broadcast Tier Pricing Instantly.',
    subheadline:
      'Scale regional supply without sales teams. Broadcast live inventory, enforce minimum order values automatically, and receive T+1 direct payouts.',
    statValue: '99.4%',
    statLabel: 'On-Time Direct Settlement Rate',
    features: [
      {
        id: 'feat-1',
        icon: ShieldCheck,
        title: 'GSTIN Verified Business Network',
        description:
          'Connect exclusively with authenticated retail store owners with verified trading credentials and verified delivery addresses.'
      },
      {
        id: 'feat-2',
        icon: CheckCircle2,
        title: 'Automated MOQ & MOV Validation',
        description:
          'Enforce custom Minimum Order Values (MOV) and unit tiers effortlessly. Inbound orders are guaranteed to meet your minimum batch requirements.'
      },
      {
        id: 'feat-3',
        icon: Building2,
        title: 'Direct Mill & Store Price Discovery',
        description:
          'Broadcast price updates to hundreds of retail buyers in under 50ms without printed price lists or endless WhatsApp threads.'
      }
    ],
    trustQuote:
      'Joined by 1,200+ local retailers & wholesale suppliers in Mumbai & Bangalore.'
  }
};

export const demoCredentials = {
  retailer: {
    login: {
      email: 'ramesh.gupta@guptamart.com',
      password: 'KiranaSecure#2026',
      rememberMe: true
    },
    signup: {
      fullName: 'Ramesh Gupta',
      businessName: 'Gupta Supermart & Provisions',
      email: 'ramesh.gupta@guptamart.com',
      phone: '9820123456',
      gstin: '27AABCG1234F1Z5',
      address: 'Shop 14, APMC Market Yard Road, Sector 19, Vashi, Navi Mumbai - 400703',
      password: 'KiranaSecure#2026',
      confirmPassword: 'KiranaSecure#2026',
      agreeTerms: true
    }
  },
  wholesaler: {
    login: {
      email: 'orders@balajiagromills.com',
      password: 'AgroMillPass#2026',
      rememberMe: true
    },
    signup: {
      fullName: 'Suresh Agarwal',
      businessName: 'Balaji Agro Grain Mills Pvt Ltd',
      email: 'orders@balajiagromills.com',
      phone: '9845098765',
      gstin: '29AADCB5678K1Z3',
      address: 'Warehouse 4B, APMC Yard Gate 2, Yeshwanthpur, Bangalore - 560022',
      mov: '25000',
      password: 'AgroMillPass#2026',
      confirmPassword: 'AgroMillPass#2026',
      agreeTerms: true
    }
  }
};
