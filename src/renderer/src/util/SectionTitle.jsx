import PropTypes from 'prop-types';

const SectionTitle = ({ title }) => (
    <h2 className="text-lg font-semibold text-teal-600 border-b pb-1">{title}</h2>
);

SectionTitle.propTypes = {
    title: PropTypes.string,
};

export default SectionTitle;
