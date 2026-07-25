export type MarketSlug = 'georgia' | 'atlanta' | 'sandy-springs' | 'marietta' | 'decatur' | 'lawrenceville' | 'alpharetta' | 'mcdonough' | 'douglasville' | 'savannah' | 'augusta' | 'macon' | 'columbus';

export interface MarketData {
  city: string;
  county: string;
  venue: string;
  eyebrow: string;
  h1place: string;
  roads: string;
  serving: string;
  placeholder: string;
  title: string;
  desc: string;
}

export const LOCALES: Record<MarketSlug, MarketData> = {
  georgia: {
    city:'Georgia', county:'Georgia', venue:'the county where the crash happened',
    eyebrow:'Georgia \u00b7 Car accident attorneys',
    h1place:'Georgia',
    roads:'I-285, I-75 and I-85',
    serving:'Serving injured drivers across Georgia from our Atlanta office',
    placeholder:'Rear-ended on I-285. The other driver was cited.',
    title:'Georgia Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in Georgia? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  },
  atlanta: {
    city:'Atlanta', county:'Fulton County', venue:'Fulton or DeKalb County',
    eyebrow:'Atlanta \u00b7 Car accident attorneys',
    h1place:'Atlanta',
    roads:'the Downtown Connector, I-285 and I-20',
    serving:'Serving Atlanta and Fulton County from our office on Central Parkway',
    placeholder:'Rear-ended on the Connector near North Avenue. Other driver was cited.',
    title:'Atlanta Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in Atlanta? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  },
  'sandy-springs': {
    city:'Sandy Springs', county:'Fulton County', venue:'Fulton County',
    eyebrow:'Sandy Springs \u00b7 Car accident attorneys',
    h1place:'Sandy Springs',
    roads:'GA-400 and I-285',
    serving:'Serving Sandy Springs from our office on Central Parkway',
    placeholder:'Hit on GA-400 near the Perimeter. Police came to the scene.',
    title:'Sandy Springs Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in Sandy Springs? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  },
  marietta: {
    city:'Marietta', county:'Cobb County', venue:'Cobb County',
    eyebrow:'Marietta \u00b7 Car accident attorneys',
    h1place:'Marietta',
    roads:'I-75 and Cobb Parkway',
    serving:'Serving Marietta and Cobb County from our Atlanta office',
    placeholder:'Rear-ended on I-75 near the South Marietta exit. Other driver was cited.',
    title:'Marietta Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in Marietta or Cobb County? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  },
  decatur: {
    city:'Decatur', county:'DeKalb County', venue:'DeKalb County',
    eyebrow:'Decatur \u00b7 Car accident attorneys',
    h1place:'Decatur',
    roads:'I-285, Memorial Drive and Scott Boulevard',
    serving:'Serving Decatur and DeKalb County from our Atlanta office',
    placeholder:'T-boned on Memorial Drive. Police report was filed.',
    title:'Decatur Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in Decatur or DeKalb County? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  },
  lawrenceville: {
    city:'Lawrenceville', county:'Gwinnett County', venue:'Gwinnett County',
    eyebrow:'Lawrenceville \u00b7 Car accident attorneys',
    h1place:'Lawrenceville',
    roads:'I-85, GA-316 and Sugarloaf Parkway',
    serving:'Serving Lawrenceville and Gwinnett County from our Atlanta office',
    placeholder:'Hit on GA-316 near Sugarloaf. Other driver ran the light.',
    title:'Lawrenceville Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in Lawrenceville or Gwinnett County? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  },
  alpharetta: {
    city:'Alpharetta', county:'Fulton County', venue:'Fulton County',
    eyebrow:'Alpharetta \u00b7 Car accident attorneys',
    h1place:'Alpharetta',
    roads:'GA-400 and Old Milton Parkway',
    serving:'Serving Alpharetta and North Fulton from our Atlanta office',
    placeholder:'Rear-ended on GA-400 at Old Milton. Other driver was cited.',
    title:'Alpharetta Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in Alpharetta? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  },
  mcdonough: {
    city:'McDonough', county:'Henry County', venue:'Henry County',
    eyebrow:'McDonough \u00b7 Car accident attorneys',
    h1place:'McDonough',
    roads:'I-75 and Jonesboro Road',
    serving:'Serving McDonough and Henry County from our Atlanta office',
    placeholder:'Hit on I-75 south of Jonesboro Road. Police came to the scene.',
    title:'McDonough Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in McDonough or Henry County? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  },
  douglasville: {
    city:'Douglasville', county:'Douglas County', venue:'Douglas County',
    eyebrow:'Douglasville \u00b7 Car accident attorneys',
    h1place:'Douglasville',
    roads:'I-20 and Chapel Hill Road',
    serving:'Serving Douglasville and Douglas County from our Atlanta office',
    placeholder:'Rear-ended on I-20 near Chapel Hill Road. Other driver was cited.',
    title:'Douglasville Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in Douglasville? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  },
  savannah: {
    city:'Savannah', county:'Chatham County', venue:'Chatham County',
    eyebrow:'Savannah \u00b7 Car accident attorneys',
    h1place:'Savannah',
    roads:'I-95, I-16 and Abercorn Street',
    serving:'Serving Savannah and Chatham County from our Atlanta office',
    placeholder:'Hit on Abercorn Street. Police report was filed.',
    title:'Savannah Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in Savannah? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  },
  augusta: {
    city:'Augusta', county:'Richmond County', venue:'Richmond County',
    eyebrow:'Augusta \u00b7 Car accident attorneys',
    h1place:'Augusta',
    roads:'I-20 and Bobby Jones Expressway',
    serving:'Serving Augusta and Richmond County from our Atlanta office',
    placeholder:'Rear-ended on Bobby Jones Expressway. Other driver was cited.',
    title:'Augusta Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in Augusta? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  },
  macon: {
    city:'Macon', county:'Bibb County', venue:'Bibb County',
    eyebrow:'Macon \u00b7 Car accident attorneys',
    h1place:'Macon',
    roads:'I-75 and I-16',
    serving:'Serving Macon and Bibb County from our Atlanta office',
    placeholder:'Hit at the I-75 and I-16 split. Police came to the scene.',
    title:'Macon Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in Macon or Bibb County? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  },
  columbus: {
    city:'Columbus', county:'Muscogee County', venue:'Muscogee County',
    eyebrow:'Columbus \u00b7 Car accident attorneys',
    h1place:'Columbus',
    roads:'I-185 and Manchester Expressway',
    serving:'Serving Columbus and Muscogee County from our Atlanta office',
    placeholder:'Rear-ended on Manchester Expressway. Other driver was cited.',
    title:'Columbus Car Accident Lawyer | Free Case Review | ACE Law, LP',
    desc:'Hurt in a car wreck in Columbus? Talk to an ACE Law attorney today. Free case review, no fee unless we win.'
  }
};
