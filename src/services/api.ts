import { Post, SiteSettings } from "../types";

export const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch("/api/posts");
  return res.json();
};

const handleResponse = async (res: Response, fallbackMsg: string) => {
  if (!res.ok) {
    let errMsg = "";
    try {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        errMsg = json.error || json.message;
      } catch (e) {
        const match = text.match(/<pre>([\s\S]*?)<\/pre>/) || text.match(/<h1>([\s\S]*?)<\/h1>/);
        errMsg = match ? match[1].replace(/<[^>]*>/g, "").trim() : text.substring(0, 200);
      }
    } catch (e) {
      errMsg = "Network or server error";
    }
    throw new Error(errMsg || fallbackMsg);
  }
};

export const createPost = async (post: Partial<Post>): Promise<{ id: number }> => {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  await handleResponse(res, "Failed to create post");
  return res.json();
};

export const updatePost = async (id: number, post: Partial<Post>): Promise<void> => {
  const res = await fetch("/api/posts/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  await handleResponse(res, "Failed to update post");
};

export const deletePost = async (id: number): Promise<void> => {
  const res = await fetch("/api/posts/" + id, {
    method: "DELETE",
  });
  await handleResponse(res, "Failed to delete post");
};

export const fetchSettings = async (): Promise<SiteSettings> => {
  const res = await fetch("/api/settings");
  return res.json();
};

export const updateSettings = async (settings: Partial<SiteSettings>): Promise<void> => {
  await fetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
};

export const submitContact = async (contact: { name: string; phone: string; message: string }): Promise<void> => {
  await fetch("/api/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
};

export const fetchContacts = async (): Promise<any[]> => {
  const res = await fetch("/api/contacts");
  return res.json();
};

export interface DonationInput {
  name: string;
  phone: string;
  email?: string;
  birthdate?: string;
  amount: number;
  payment_day: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
}

export const submitDonation = async (donation: DonationInput): Promise<void> => {
  await fetch("/api/donations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donation),
  });
};

export const fetchDonations = async (): Promise<any[]> => {
  const res = await fetch("/api/donations");
  return res.json();
};

export const deleteDonation = async (id: number): Promise<void> => {
  const res = await fetch("/api/donations/" + id, {
    method: "DELETE",
  });
  await handleResponse(res, "Failed to delete donation");
};

export const deleteContact = async (id: number): Promise<void> => {
  const res = await fetch("/api/contacts/" + id, {
    method: "DELETE",
  });
  await handleResponse(res, "Failed to delete contact");
};
