export interface ProfileValueChange {
  name: string;
  value: string;
}

export interface Profile {
  id: number;
  values: object;
  factors: object;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  sex: "U" | "F" | "M";
  active_profile: Profile;
  finished_profiles: {
    id: number;
    created_at: string;
  }[];
}

export interface LoginData {
  token: string;
  user: User;
}

export interface FactorGoal {
  checked: boolean;
  plan: string;
}

export interface GoalPlan {
  categoryId: number;
  date: string;
  factors?: Record<number, FactorGoal>;
}

export const enum FmsType {
  Work = "work",
  School = "school",
}
