export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url: string;
  created_at: string;
}

export interface SiteSettings {
  site_name: string;
  primary_color: string;
  bg_color: string;
  chairperson_image?: string;
}
