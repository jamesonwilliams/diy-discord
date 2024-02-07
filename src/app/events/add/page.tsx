"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  title: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  ticketUrl: string;
  venueName: string;
  venueLocation: string;
  venueUrl: string;
  bandNames: string;
}

const emptyFormData: FormData = {
  title: "",
  startDate: "",
  endDate: "",
  imageUrl: "",
  ticketUrl: "",
  venueName: "",
  venueLocation: "",
  venueUrl: "",
  bandNames: "",
};

export default function AddEventPage() {
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
      const response = await fetch("/api/events/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionMessage("Form submitted successfully!");
        setFormData(emptyFormData);
        router.push("/events");
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
      <h1 className="text-xl pt-8">Add an event</h1>
      <form className="p-4" onSubmit={handleSubmit}>
        <InputFields formData={formData} handleChange={handleChange} />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 m-4 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {submissionMessage && (
        <p className="mx-auto text-red-400">{submissionMessage}</p>
      )}
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
  const divClass = "flex flex-col items-center mb-2";
  const labelClass = "w-72 mt-1 text-left";
  const inputClass = `
    flex-grow p-2 text-black rounded-md border border-gray-500 text-sm w-72
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-200
  `;

  return (
    <>
      <div className={divClass} tabIndex={1}>
        <label htmlFor="title" className={labelClass}>
          Event title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          autoCapitalize="words"
          spellCheck="true"
          autoCorrect="on"
          autoFocus
          placeholder="Type event name here..."
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="startDate" className={labelClass}>
          Start date/time
        </label>
        <input
          type="datetime-local"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          placeholder="2022-12-31T23:59"
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="endDate" className={labelClass}>
          End date/time
        </label>
        <input
          type="datetime-local"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          placeholder="2022-12-31T23:59"
          className={inputClass}
        />
      </div>

      <div className={divClass}>
        <label htmlFor="imageUrl" className={labelClass}>
          Image URL
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          autoComplete="url"
          placeholder="https://kool-event.com/image.jpg"
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="ticketUrl" className={labelClass}>
          Buy ticket URL
        </label>
        <input
          type="url"
          id="ticketUrl"
          name="ticketUrl"
          value={formData.ticketUrl}
          onChange={handleChange}
          autoComplete="url"
          placeholder="https://kool-event.com/tickets"
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="venueName" className={labelClass}>
          Venue name
        </label>
        <input
          type="text"
          id="venueName"
          name="venueName"
          value={formData.venueName}
          onChange={handleChange}
          placeholder="Homiefest Y2K90"
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="venueLocation" className={labelClass}>
          Venue location
        </label>
        <input
          type="text"
          id="venueLocation"
          name="venueLocation"
          value={formData.venueLocation}
          onChange={handleChange}
          placeholder="St. Louis, MO"
          spellCheck="true"
          autoCorrect="on"
          autoCapitalize="words"
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="venueUrl" className={labelClass}>
          Venue URL
        </label>
        <input
          type="url"
          id="venueUrl"
          name="venueUrl"
          value={formData.venueUrl}
          onChange={handleChange}
          autoComplete="url"
          placeholder="https://kool-venue.com"
          className={inputClass}
        />
      </div>
      <div className={divClass}>
        <label htmlFor="bandNames" className={labelClass}>
          Band names
        </label>
        <input
          type="text"
          id="bandNames"
          name="bandNames"
          value={formData.bandNames}
          onChange={handleChange}
          placeholder="The Others Like Us, Aren't We Amphibians"
          className={inputClass}
        />
      </div>
    </>
  );
}
