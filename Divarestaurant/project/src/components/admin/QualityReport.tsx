import React from 'react';
import { ValidationReport, ValidationIssue } from '../../types/validation';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface QualityReportProps {
  report: ValidationReport;
}

export function QualityReport({ report }: QualityReportProps) {
  return (
    <div className="space-y-8">
      <Section title="Page d'accueil">
        <CheckItem
          label="Vidéo d'ambiance"
          passed={report.checks.homepage.video.isPlaying}
          details="Vérification du chargement et de la lecture automatique"
        />
        <CheckItem
          label="Navigation"
          passed={Object.values(report.checks.homepage.navigation.links).every(Boolean)}
          details="Vérification des liens et de la structure"
        />
      </Section>

      <Section title="Réservations">
        <CheckItem
          label="Formulaire"
          passed={report.checks.reservation.form.requiredFields}
          details="Validation des champs et de la logique"
        />
        <CheckItem
          label="Paiement"
          passed={report.checks.reservation.payment.secureConnection}
          details="Sécurité et intégration Stripe"
        />
      </Section>

      {report.issues.length > 0 && (
        <Section title="Problèmes détectés">
          {report.issues.map((issue, index) => (
            <IssueItem key={index} issue={issue} />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-admin-card rounded-lg shadow-lg p-6 border border-white/10">
      <h3 className="text-xl font-medium text-gold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function CheckItem({ label, passed, details }: { label: string; passed: boolean; details: string }) {
  return (
    <div className="flex items-start gap-3">
      {passed ? (
        <CheckCircle className="text-green-500 shrink-0" />
      ) : (
        <XCircle className="text-red-500 shrink-0" />
      )}
      <div>
        <p className="font-medium text-admin-text">{label}</p>
        <p className="text-sm text-admin-text-secondary">{details}</p>
      </div>
    </div>
  );
}

function IssueItem({ issue }: { issue: ValidationIssue }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-lg">
      <AlertTriangle className="text-red-500 shrink-0" />
      <div>
        <p className="font-medium text-admin-text">{issue.component}</p>
        <p className="text-sm text-admin-text-secondary">{issue.description}</p>
        <p className="text-sm text-admin-text-secondary mt-1">
          Recommandation : {issue.recommendation}
        </p>
      </div>
    </div>
  );
}