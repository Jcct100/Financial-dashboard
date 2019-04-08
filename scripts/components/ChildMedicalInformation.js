import React from 'react';
import PropTypes from 'prop-types';

const ChildMedicalInformation = ({ child }) => {
    return (
        <div className="child__medical-information">
            <h2>Medical Information</h2>

            <table className="tab-table">
                <tbody>
                    <tr className="tab-table__row">
                        <td className="tab-table__cell tab-table__key">Medical requirements:</td>
                        <td className="tab-table__cell tab-table__value">{ child.medicalRequirements || '-' }</td>
                    </tr>
                    <tr className="tab-table__row">
                        <td className="tab-table__cell tab-table__key">Dietary requirements:</td>
                        <td className="tab-table__cell tab-table__value">{ child.dietaryRequirements || '-' }</td>
                    </tr>
                    <tr className="tab-table__row">
                        <td className="tab-table__cell tab-table__key">Allergies:</td>
                        <td className="tab-table__cell tab-table__value">{ child.allergies || '-' }</td>
                    </tr>

                    <tr className="tab-table__row" />

                    <tr className="tab-table__row">
                        <td className="tab-table__cell tab-table__key">Has allergy requiring EpiPen?</td>
                        <td className="tab-table__cell tab-table__value">{ child.hasAllergyRequiringEpiPen ? 'Yes' : 'No' }</td>
                    </tr>
                    <tr className="tab-table__row">
                        <td className="tab-table__cell tab-table__key">Has epilepsy?</td>
                        <td className="tab-table__cell tab-table__value">{ child.hasEpilepsy ? 'Yes' : 'No' }</td>
                    </tr>
                    <tr className="tab-table__row">
                        <td className="tab-table__cell tab-table__key">Behavioural, social and additional needs:</td>
                        <td className="tab-table__cell tab-table__value">{ child.behaviouralSocialAdditionalNeeds ? 'Yes' : 'No' }</td>
                    </tr>

                    <tr className="tab-table__row" />

                    <tr className="tab-table__row">
                        <td className="tab-table__cell tab-table__key">Take child to the hospital?</td>
                        <td className="tab-table__cell tab-table__value">{ child.takeToHospital ? 'Yes' : 'No' }</td>
                    </tr>
                    <tr className="tab-table__row">
                        <td className="tab-table__cell tab-table__key">Provide child with paracetamol?</td>
                        <td className="tab-table__cell tab-table__value">{ child.paracetamol ? 'Yes' : 'No' }</td>
                    </tr>
                    <tr className="tab-table__row">
                        <td className="tab-table__cell tab-table__key">Provide child with ibuprofen?</td>
                        <td className="tab-table__cell tab-table__value">{ child.ibuprofen ? 'Yes' : 'No' }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

ChildMedicalInformation.propTypes = {
    child: PropTypes.object.isRequired
};

export default ChildMedicalInformation;
