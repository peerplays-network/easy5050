import React from 'react';

const SignUpConfirmation = continueAction => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center darkGrey-mirror pt-5 pb-5 height-35">
      <h3 className="text-golden underline-golden text-uppercase mb-3 pb-2">
        Your account has been created!
      </h3>
      <button className="btn mt-4">Continue</button>
    </div>
  );
};

export default SignUpConfirmation;
