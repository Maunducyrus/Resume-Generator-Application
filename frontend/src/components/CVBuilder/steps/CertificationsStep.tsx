import React, { useState } from "react";
import { Plus, Trash2, Award, ExternalLink } from "lucide-react";
import { useCV } from "../../../context/CVContext";
import type { Certification } from "../../../types";

const CertificationsStep: React.FC = () => {
  const { state: cvState, setCurrentCV } = useCV();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const certifications = cvState.currentCV?.certifications || [];

  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
      credentialId: "",
      url: "",
    };

    const updatedCV = {
      ...cvState.currentCV,
      certifications: [...certifications, newCertification],
    };
    setCurrentCV(updatedCV as any);
    setEditingIndex(certifications.length);
  };

  const updateCertification = (
    index: number,
    field: keyof Certification,
    value: string,
  ) => {
    const updatedCertifications = certifications.map((cert, i) =>
      i === index ? { ...cert, [field]: value } : cert,
    );

    const updatedCV = {
      ...cvState.currentCV,
      certifications: updatedCertifications,
    };
    setCurrentCV(updatedCV as any);
  };

  const removeCertification = (index: number) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    const updatedCV = {
      ...cvState.currentCV,
      certifications: updatedCertifications,
    };
    setCurrentCV(updatedCV as any);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Certifications
        </h3>
        <p className="text-gray-600 mb-6">
          Add your professional certifications, licenses, and credentials that
          are relevant to your career.
        </p>
      </div>

      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={cert.id} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-gray-900">
                  {cert.name || "New Certification"}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setEditingIndex(editingIndex === index ? null : index)
                  }
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {editingIndex === index ? "Collapse" : "Edit"}
                </button>
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="text-red-600 hover:text-red-700"
                  aria-label="Remove Certification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {editingIndex === index && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) =>
                      updateCertification(index, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="AWS Certified Solutions Architect"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) =>
                      updateCertification(index, "issuer", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Amazon Web Services"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`cert-date-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Issue Date *
                  </label>
                  <input
                    id={`cert-date-${index}`}
                    type="month"
                    value={cert.date}
                    onChange={(e) =>
                      updateCertification(index, "date", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="YYYY-MM"
                    title="Select issue month and year"
                    aria-describedby={`cert-date-help-${index}`}
                  />
                  <p id={`cert-date-help-${index}`} className="sr-only">
                    Please select the month and year when the certification was
                    issued
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={`cert-expiry-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Expiry Date (Optional)
                  </label>
                  <input
                    id={`cert-expiry-${index}`}
                    type="month"
                    value={cert.expiryDate}
                    onChange={(e) =>
                      updateCertification(index, "expiryDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="YYYY-MM"
                    title="Select expiry month and year"
                    aria-describedby={`cert-expiry-help-${index}`}
                  />
                  <p id={`cert-expiry-help-${index}`} className="sr-only">
                    Please select the month and year when the certification
                    expires (if applicable)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credential ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={cert.credentialId}
                    onChange={(e) =>
                      updateCertification(index, "credentialId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ABC123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credential URL (Optional)
                  </label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      value={cert.url}
                      onChange={(e) =>
                        updateCertification(index, "url", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://credly.com/badges/..."
                    />
                  </div>
                </div>
              </div>
            )}

            {editingIndex !== index && cert.name && (
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{cert.name}</p>
                <p>{cert.issuer}</p>
                <p>
                  Issued: {cert.date}{" "}
                  {cert.expiryDate && `• Expires: ${cert.expiryDate}`}
                </p>
                {cert.credentialId && <p>Credential ID: {cert.credentialId}</p>}
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center mt-1"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Credential
                  </a>
                )}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addCertification}
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Certification
        </button>
      </div>

      {certifications.length === 0 && (
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No certifications added yet
          </h3>
          <p className="text-gray-600 mb-4">
            Certifications are optional but can strengthen your professional
            profile
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificationsStep;
