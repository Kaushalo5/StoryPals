export type StoryCategory = 'father-child' | 'grandma-child' | 'siblings' | 'surprise';

export interface StoryPage {
  text: string;
  imageUrl: string;
}

export interface Story {
  title: string;
  pages: StoryPage[];
  category: StoryCategory;
}

export interface ChildInfo {
  name: string;
  gender: string;
  category: StoryCategory;
  childPhoto?: string; // base64
  adultPhoto?: string; // base64
  adultName?: string;
  adultGender?: string;
  description?: string;
}
