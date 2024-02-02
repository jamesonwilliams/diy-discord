"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  city: string;
  state: string;
  country: string;
  spotify: string;
  twitter: string;
  instagram: string;
  bandcamp: string;
}

const emptyFormData: FormData = {
  name: "",
  city: "",
  state: "",
  country: "",
  spotify: "",
  twitter: "",
  instagram: "",
  bandcamp: "",
};

export default function AddBandPage() {
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionMessage, setSubmissionMessage] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/add-band", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionMessage("Form submitted successfully!");
        setFormData(emptyFormData);
        router.push("/bands");
      } else {
        const message = (await response.json()).error;
        setSubmissionMessage(message);
      }
    } catch (error) {
      setSubmissionMessage("An error occurred. Please try again later.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="text-center">
      <h1 className="text-xl pt-8">Add a band</h1>
      <form className="p-4" onSubmit={handleSubmit}>
        <InputFields formData={formData} handleChange={handleChange} />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {submissionMessage && <p className="w-96 mx-auto text-red-400">{submissionMessage}</p>}
    </div>
  );
}

function InputFields({
  formData,
  handleChange,
}: {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const divClass = "flex items-center mb-2";
  const labelClass = "w-24 mr-2 text-right";
  const inputClass = `
    flex-grow p-2 text-black rounded-md border border-gray-500 text-sm w-64
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-200
  `;

  return (
    <>
      <div className={divClass} tabIndex={1}>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="organization"
          autoCapitalize="words"
          spellCheck="true"
          autoCorrect="on"
          autoFocus
          placeholder="Type Band Name Here"
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="city" className={labelClass}>
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          autoComplete="address-level2"
          placeholder="Chicago"
          spellCheck="true"
          autoCorrect="on"
          autoCapitalize="words"
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="state" className={labelClass}>
          State
        </label>
        <input
          type="text"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          autoComplete="address-level1"
          placeholder="IL"
          autoCapitalize="characters"
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="country" className={labelClass}>
          Country
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          autoComplete="country"
          placeholder="US"
          autoCapitalize="characters"
          className={inputClass}
        />
      </div>

      <div className={divClass}>
        <label htmlFor="spotify" className={labelClass}>
          Spotify
        </label>
        <input
          type="url"
          id="spotify"
          name="spotify"
          value={formData.spotify}
          onChange={handleChange}
          autoComplete="url"
          placeholder="https://open.spotify.com/artist/2JxmoHIJJlVglBY5AXSbSA?si=vkwnMjgrS_eWseWya2QLTg"
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="twitter" className={labelClass}>
          X
        </label>
        <input
          type="url"
          id="twitter"
          name="twitter"
          value={formData.twitter}
          onChange={handleChange}
          autoComplete="url"
          placeholder="https://x.com/EMWAY608"
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="instagram" className={labelClass}>
          Instagram
        </label>
        <input
          type="url"
          id="instagram"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
          autoComplete="url"
          placeholder="https://www.instagram.com/emway608"
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="bandcamp" className={labelClass}>
          Bandcamp
        </label>
        <input
          type="url"
          id="bandcamp"
          name="bandcamp"
          value={formData.bandcamp}
          onChange={handleChange}
          autoComplete="url"
          placeholder="https://emway.bandcamp.com"
          className={inputClass}
        />
      </div>
    </>
  );
}
