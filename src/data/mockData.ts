import type { Committee } from '../types';

export const committees: Committee[] = [
  {
    id: 'disec',
    name: 'DISEC',
    shortDescription: 'Disarmament and International Security Committee.',
    description: 'The First Committee of the UN General Assembly deals with disarmament, global challenges, and threats to peace that affect the international community.',
    difficulty: 'Intermediate',
    capacity: 60,
    agenda: 'Legitimacy of Foreign Military Bases in Sovereign States and Potential Risks',
    chair: {
      name: 'TBD',
      role: 'Chairperson'
    },
    image: '/images/disec.png'
  },
  {
    id: 'who',
    name: 'WHO',
    shortDescription: 'World Health Organization.',
    description: 'The WHO is responsible for international public health. Delegates will address global health emergencies and promote international health equity.',
    difficulty: 'Beginner',
    capacity: 50,
    agenda: 'Addressing the Global Mental Health Crisis Among Youth with a Focus on Social Media and Screen Addiction',
    chair: {
      name: 'TBD',
      role: 'Chairperson'
    },
    image: '/images/who.png'
  },
  {
    id: 'unep',
    name: 'UNEP',
    shortDescription: 'United Nations Environment Programme.',
    description: 'UNEP coordinates the organization\'s environmental activities and assists developing countries in implementing environmentally sound policies and practices.',
    difficulty: 'Beginner',
    capacity: 40,
    agenda: 'Addressing the Global Environmental and Public Health Risks of Per- and Polyfluoroalkyl Substances (PFAS) through Sustainable Chemical Management',
    chair: {
      name: 'TBD',
      role: 'Chairperson'
    },
    image: '/images/unep.png'
  },
  {
    id: 'g20',
    name: 'G20',
    shortDescription: 'Group of Twenty.',
    description: 'The G20 is the premier forum for international economic cooperation, bringing together the leaders of major developed and developing economies.',
    difficulty: 'Advanced',
    capacity: 25,
    agenda: 'Open Agenda',
    chair: {
      name: 'TBD',
      role: 'Chairperson'
    },
    image: '/images/g20.png'
  },
  {
    id: 'nato',
    name: 'NATO',
    shortDescription: 'North Atlantic Treaty Organization.',
    description: 'NATO is an intergovernmental military alliance. It constitutes a system of collective defense whereby its independent member states agree to mutual defense.',
    difficulty: 'Intermediate',
    capacity: 30,
    agenda: 'Coordinating NATO\'s collective response to the September 11 terrorist attacks',
    chair: {
      name: 'TBD',
      role: 'Secretary General'
    },
    image: '/images/nato.png'
  },
  {
    id: 'himf',
    name: 'H-IMF',
    shortDescription: 'Historical International Monetary Fund.',
    description: 'The Historical IMF committee focuses on major global financial crises from the past, requiring delegates to navigate complex economic restructuring.',
    difficulty: 'Advanced',
    capacity: 25,
    agenda: 'The 1980s Latin American Debt Crisis',
    chair: {
      name: 'TBD',
      role: 'Managing Director'
    },
    image: '/images/himf.png'
  },
  {
    id: 'fcc',
    name: 'FCC',
    shortDescription: 'Fallout Crisis Committee.',
    description: 'A special crisis committee set in the post-apocalyptic Fallout universe. Delegates must manage resources and navigate treacherous wasteland politics.',
    difficulty: 'Advanced',
    capacity: 20,
    agenda: 'Fallout',
    chair: {
      name: 'TBD',
      role: 'Crisis Director'
    },
    image: '/images/fcc.png'
  },
  {
    id: 'mkk',
    name: 'MKK',
    shortDescription: 'Müşterek Kriz Komitesi.',
    description: 'A historical crisis committee focusing on the Great Heathen Army (Büyük Viking Ordusu). Navigate internal power struggles and external conquests.',
    difficulty: 'Advanced',
    capacity: 20,
    agenda: 'Büyük Viking Ordusu',
    chair: {
      name: 'TBD',
      role: 'Crisis Director'
    },
    image: '/images/mkk.png'
  }
];
