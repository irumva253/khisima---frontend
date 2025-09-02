import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To Khisima',
  description: 'Let your words travel. Let your data speak.',
  keywords: 'Translation, Localization, Multilingual and NLP data service',
};

export default Meta;