export interface Committee {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  capacity: number;
  agenda: string;
  chair: {
    name: string;
    role: string;
  };
  image: string;
}

export interface Application {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  country: string;
  committeeId: string;
  experience: string;
  motivationLetter: string;
  agreeTerms: boolean;
}
