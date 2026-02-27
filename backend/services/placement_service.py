"""
Placement readiness scoring and resource recommendation service.
"""
from models import Assessment, Progress, UserProfile


class PlacementService:

    def calculate_readiness(self, uid: int) -> dict:
        prog    = Progress.query.filter_by(user_id=uid).first()
        profile = UserProfile.query.filter_by(user_id=uid).first()

        if not prog:
            return {'placement_readiness': 0, 'breakdown': {}}

        breakdown = {
            'skill_score'        : prog.skill_score,
            'aptitude_score'     : prog.aptitude_score,
            'resume_score'       : prog.resume_score,
            'roadmap_completion' : prog.roadmap_completion,
        }

        readiness = round(
            (prog.skill_score      * 0.40) +
            (prog.aptitude_score   * 0.30) +
            (prog.resume_score     * 0.20) +
            (prog.roadmap_completion * 0.10), 2
        )

        level = "Beginner"
        if readiness >= 70:
            level = "Placement Ready"
        elif readiness >= 50:
            level = "Intermediate"

        return {
            'placement_readiness': readiness,
            'level'              : level,
            'breakdown'          : breakdown
        }