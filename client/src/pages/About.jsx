import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          {t('about.title')}
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {t('about.description')}
        </p>
        <div className="text-left space-y-6">
          <p className="text-gray-700 leading-loose">
            We are a trusted real estate company with a passion for helping you
            find your dream property. Our portfolio includes a diverse range of
            properties to suit every lifestyle and budget.
          </p>
          <p className="text-gray-700 leading-loose">
            From cozy apartments to spacious family homes, our expert team is
            dedicated to guiding you through every step of the process. Let us
            help you turn your dream into reality.
          </p>
        </div>
      </div>
    </section>
  )
}
