import type { Committee } from '../types';

export const committees: Committee[] = [
  {
    id: 'unsc',
    name: 'United Nations Security Council',
    shortDescription: 'Addressing the most critical international security threats.',
    description: 'The Security Council has primary responsibility for the maintenance of international peace and security. In this committee, delegates will navigate high-stakes diplomatic crises.',
    difficulty: 'Advanced',
    capacity: 15,
    agenda: 'The situation in the South China Sea',
    chair: {
      name: 'Alexander Sterling',
      role: 'President of the Security Council'
    },
    image: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'disec',
    name: 'DISEC',
    shortDescription: 'First Committee of the UN General Assembly.',
    description: 'The Disarmament and International Security Committee deals with disarmament, global challenges, and threats to peace that affect the international community.',
    difficulty: 'Intermediate',
    capacity: 60,
    agenda: 'Regulation of Autonomous Weapons Systems',
    chair: {
      name: 'Sophia Laurent',
      role: 'Chairperson'
    },
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'unep',
    name: 'UNEP',
    shortDescription: 'United Nations Environment Programme.',
    description: 'UNEP coordinates the organization\'s environmental activities and assists developing countries in implementing environmentally sound policies and practices.',
    difficulty: 'Beginner',
    capacity: 40,
    agenda: 'Protecting Deep Sea Marine Biodiversity',
    chair: {
      name: 'James O\'Connor',
      role: 'Executive Director'
    },
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'who',
    name: 'World Health Organization',
    shortDescription: 'Directing and coordinating authority on international health.',
    description: 'The WHO is responsible for international public health. Delegates will address global health emergencies and promote international health equity.',
    difficulty: 'Beginner',
    capacity: 50,
    agenda: 'Preparing for Waterborne Pandemics',
    chair: {
      name: 'Dr. Elena Rostova',
      role: 'Director-General'
    },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
  }
];
