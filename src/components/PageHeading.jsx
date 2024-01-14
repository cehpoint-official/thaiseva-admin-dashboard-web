const PageHeading = ({ text }) => {
  return (
    <h3 className="md:text-3xl text-xl text-center font-bold border-b-2 pb-2 mb-2 border-[var(--primary-bg)] text-[var(--primary-bg)]">
      {text}
    </h3>
  );
};

export default PageHeading;
