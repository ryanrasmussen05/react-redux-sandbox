import { Icon } from "antd";
import React from 'react';
import { connect } from "react-redux";
import { match } from 'react-router';
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { fetchResumeIfNeeded } from "../../actions/resumeActions";
import { EducationItem, EmploymentItem, Resume } from "../../models/resume";
import { AppState } from "../../reducers";
import { getResume, isFetchingResume } from "../../reducers/selectors";
import Footer from "../common/Footer";
import Header from '../common/Header';
import Education from "./Education";
import Employment from "./Employment";
import './ResumePage.scss';

interface ResumePageProps {
    match: match,
    fetchResume: () => void,
    loading: boolean,
    resume: Resume | null
}

class ResumePage extends React.Component<ResumePageProps> {
    render() {
        return (
            <div className="resume-page">
                <Header currentPath={this.props.match.url}/>

                <div className="page-content">
                    <div className="page-title">Resume</div>

                    {this.props.loading &&
                    <div className="loading-indicator">
                        <Icon type="sync" spin/>
                    </div>
                    }

                    {!this.props.loading && this.props.resume &&
                    <div>
                        <div className="resume-section resume-section-header">
                            Employment
                        </div>

                        {this.props.resume.employment.map((employment: EmploymentItem) => (
                            <div key={employment.company} className="resume-section">
                                <Employment job={employment}/>
                            </div>
                        ))}

                        <div className="resume-section resume-section-header education-header">
                            Education
                        </div>

                        {this.props.resume.education.map((education: EducationItem) => (
                            <div key={education.degree} className="resume-section">
                                <Education degree={education}/>
                            </div>
                        ))}
                    </div>
                    }
                </div>

                <Footer/>
            </div>
        );
    }

    componentDidMount(): void {
        this.props.fetchResume();
    }
}

function mapStateToProps(state: AppState) {
    return {
        loading: isFetchingResume(state),
        resume: getResume(state)
    };
}

function mapDispatchToProps(dispatch: ThunkDispatch<any, any, AnyAction>) {
    return {
        fetchResume: () => {
            dispatch(fetchResumeIfNeeded())
        }
    }
}

const ConnectedResumePage = connect(mapStateToProps, mapDispatchToProps)(ResumePage);

export default ConnectedResumePage;