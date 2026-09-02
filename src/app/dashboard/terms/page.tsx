"use client";

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Informations légales</p>
        <h1 className="text-xl font-extrabold text-gray-900">Politique d&apos;utilisation</h1>
      </div>

      <div className="card card-padded space-y-5 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">1. Acceptation des conditions</h2>
          <p>
            En utilisant la plateforme Trionda, vous acceptez les présentes conditions
            d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas
            utiliser nos services.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">2. Description du service</h2>
          <p>
            Trionda est une plateforme d&apos;investissement en ligne opérant au Burkina Faso.
            Elle permet aux utilisateurs de souscrire à des plans d&apos;investissement,
            d&apos;effectuer des dépôts et des retraits, et de bénéficier de rendements
            conformément aux plans choisis.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">3. Compte utilisateur</h2>
          <p>
            Vous êtes responsable de la confidentialité de vos identifiants de connexion.
            Toute activité effectuée depuis votre compte est sous votre responsabilité.
            Trionda se réserve le droit de suspendre ou de résilier tout compte en cas
            de violation des présentes conditions.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">4. Dépôts et retraits</h2>
          <p>
            Les dépôts sont traités via Orange Money Burkina Faso. Les retraits sont
            soumis à validation et ne peuvent être effectués que si l&apos;utilisateur
            dispose d&apos;un investissement actif. Les délais de traitement peuvent
            varier de 24 à 48 heures.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">5. Investissements et rendements</h2>
          <p>
            Les rendements sont calculés selon les taux affichés pour chaque plan
            d&apos;investissement. Trionda ne garantit pas de rendements futurs et se
            réserve le droit de modifier les conditions des plans à tout moment.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">6. Parrainage</h2>
          <p>
            Le système de parrainage fonctionne sur 3 niveaux. Les commissions sont
            versées uniquement sur le premier dépôt des filleuls. Tout abus du système
            de parrainage peut entraîner la suspension du compte.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">7. Protection des données</h2>
          <p>
            Trionda s&apos;engage à protéger vos données personnelles conformément aux
            lois en vigueur au Burkina Faso. Vos informations ne sont jamais partagées
            avec des tiers sans votre consentement explicite.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">8. Limitation de responsabilité</h2>
          <p>
            Trionda ne pourra être tenue responsable des pertes résultant de
            l&apos;utilisation de la plateforme, y compris les pertes de données,
            les interruptions de service ou les retards de traitement.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">9. Modification des conditions</h2>
          <p>
            Trionda se réserve le droit de modifier ces conditions à tout moment.
            Les utilisateurs seront informés des modifications via la plateforme.
            L&apos;utilisation continue des services après modification vaut acceptation
            des nouvelles conditions.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">10. Contact</h2>
          <p>
            Pour toute question concernant ces conditions, contactez-nous via :
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <a href="https://t.me/trionda_service01" target="_blank" rel="noopener noreferrer"
              className="text-brand-600 hover:text-brand-700 font-medium text-sm">
              Telegram : @trionda_service01
            </a>
            <a href="https://chat.whatsapp.com/LwlRMaQudAzCxF4xQiU4vp" target="_blank" rel="noopener noreferrer"
              className="text-brand-600 hover:text-brand-700 font-medium text-sm">
              WhatsApp : Groupe Trionda
            </a>
          </div>
        </section>

        <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
        </div>
      </div>
    </div>
  );
}