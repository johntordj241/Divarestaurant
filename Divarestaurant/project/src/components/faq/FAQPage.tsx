import React from 'react';
import { ChevronDown, ChevronUp, Calendar, UtensilsCrossed, CreditCard, Info, Users } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    id: 'reservations',
    title: 'Réservations',
    icon: Calendar,
    items: [
      {
        question: "Comment puis-je réserver une table ?",
        answer: "Vous pouvez réserver directement sur notre site via la page Réservation, ou nous contacter par téléphone. Un acompte sera demandé pour confirmer votre réservation."
      },
      {
        question: "Quelle est votre politique d'annulation ?",
        answer: "Les annulations sont gratuites jusqu'à 48h avant l'événement. Au-delà, 50% du montant total sera retenu."
      },
      {
        question: "Puis-je réserver pour un grand groupe ?",
        answer: "Oui, nous accueillons les groupes jusqu'à 15 personnes. Pour des groupes plus importants ou des événements privés, merci de nous contacter directement."
      },
      {
        question: "Dois-je payer un acompte ?",
        answer: "Oui, un acompte de 30% est demandé pour confirmer votre réservation. Le solde sera réglé le jour de votre venue."
      }
    ]
  },
  {
    id: 'menu',
    title: 'Menu et Options Alimentaires',
    icon: UtensilsCrossed,
    items: [
      {
        question: "Proposez-vous des options végétariennes ?",
        answer: "Oui, nous proposons plusieurs options végétariennes et pouvons adapter nos menus aux restrictions alimentaires avec un préavis."
      },
      {
        question: "Y a-t-il des menus enfants ?",
        answer: "Oui, nous proposons un menu enfant à 20€, incluant un plat principal et un dessert."
      },
      {
        question: "Vos produits sont-ils locaux et de saison ?",
        answer: "Oui, nous privilégions les produits frais, locaux et de saison pour garantir une qualité optimale."
      },
      {
        question: "Puis-je commander un gâteau pour un événement spécial ?",
        answer: "Absolument. Contactez-nous au moins 48h à l'avance pour commander un gâteau personnalisé."
      }
    ]
  },
  {
    id: 'payment',
    title: 'Paiement et Tarifs',
    icon: CreditCard,
    items: [
      {
        question: "Quels moyens de paiement acceptez-vous ?",
        answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), les espèces et les chèques vacances."
      },
      {
        question: "Proposez-vous des offres spéciales ?",
        answer: "Oui, nous avons des menus combinés incluant repas et spectacle, à partir de 75€."
      },
      {
        question: "Puis-je offrir une carte cadeau ?",
        answer: "Oui, vous pouvez acheter une carte cadeau directement sur notre site ou à l'accueil."
      }
    ]
  },
  {
    id: 'practical',
    title: 'Informations Pratiques',
    icon: Info,
    items: [
      {
        question: "Y a-t-il un code vestimentaire ?",
        answer: "Oui, une tenue élégante est recommandée. Les shorts, tongs et vêtements de sport ne sont pas acceptés."
      },
      {
        question: "Disposez-vous d'un parking ?",
        answer: "Oui, nous avons un parking privé et un service voiturier est disponible."
      },
      {
        question: "Le lieu est-il accessible aux personnes à mobilité réduite ?",
        answer: "Oui, notre établissement est entièrement accessible aux personnes à mobilité réduite."
      }
    ]
  },
  {
    id: 'events',
    title: 'Événements et Spectacles',
    icon: Users,
    items: [
      {
        question: "Quels types de spectacles proposez-vous ?",
        answer: "Nous proposons des spectacles cabaret, concerts live et soirées à thème qui changent chaque semaine."
      },
      {
        question: "Peut-on organiser un événement privé ?",
        answer: "Oui, nous proposons des privatisations pour les mariages, anniversaires ou événements d'entreprise."
      },
      {
        question: "Les spectacles sont-ils inclus dans le prix du repas ?",
        answer: "Oui, le spectacle est inclus dans nos formules dîner-spectacle."
      }
    ]
  }
];

export function FAQPage() {
  const [openCategory, setOpenCategory] = React.useState<string | null>('reservations');
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (categoryId: string, index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [`${categoryId}-${index}`]: !prev[`${categoryId}-${index}`]
    }));
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12 text-white">FAQ</h1>
        
        {/* Catégories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {FAQ_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setOpenCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
                openCategory === category.id
                  ? 'bg-gold text-black'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              <category.icon size={20} />
              <span>{category.title}</span>
            </button>
          ))}
        </div>

        {/* Questions et réponses */}
        <div className="space-y-6">
          {FAQ_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className={`transition-all duration-300 ${
                openCategory === category.id ? 'block' : 'hidden'
              }`}
            >
              {category.items.map((item, index) => (
                <div key={index} className="mb-4">
                  <button
                    onClick={() => toggleItem(category.id, index)}
                    className="w-full p-6 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-between text-left transition-colors"
                  >
                    <h3 className="text-xl font-serif text-gold">{item.question}</h3>
                    {openItems[`${category.id}-${index}`] ? (
                      <ChevronUp className="text-gold" />
                    ) : (
                      <ChevronDown className="text-gold" />
                    )}
                  </button>
                  
                  {openItems[`${category.id}-${index}`] && (
                    <div className="p-6 bg-white/5 rounded-b-lg mt-px">
                      <p className="text-gray-300">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}