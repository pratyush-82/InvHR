const { object, string, date } = require("yup");
const {
  sendResponse,
  requestFail,
  requestSuccess,
} = require("../helpers/RequestResponse.helper");
const { generateId } = require("../helpers/Common.helper");
const Appraisal = require("../models/Appraisal.modal");
const model = require("../models/Employee.model");
async function create(req, res) {
  const { body } = req;
  const AppraisalSchema = object({
    employeeId: string().required("Apraisee  is required"),
    appraisalDate: string().required("Appraisal date is required"),
    reviewingAppraiser: string().required("Review Appraiser is required"),
    hrName: string().required("Hr name is required"),
  });
  let appraisal_ = null;
  try {
    appraisal_ = await AppraisalSchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }
  let dbAppraisal = null;
  try {
    dbAppraisal = await Appraisal.findOne({ employeeId: appraisal_.employeeId });
    if (dbAppraisal) return requestFail(res, "Already existing Appraisal name.");
  } catch (e) {
    return requestFail(res, "Something went wrong");
  }
  if (!appraisal_ && dbAppraisal != null)
    requestFail(res, "Something went wrong. Try again");
  const id = `APR${generateId()}`;
  user = await model.findOne({ empId: appraisal_.employeeId.toUpperCase() });
  new Appraisal({
    aprId: id,
    employeeId: appraisal_.employeeId,
    employeeName: user.name,
    emailId: user.email,
    designation: user.designation,
    totalExperience: 1,
    inevitableExperience: 1,
    reportingperson: user.reportingPerson,
    reviewingAppraiser: appraisal_.reviewingAppraiser,
    hrName: appraisal_.hrName,
    dateOfJoining: user.DOJ,
    appraisalDate: appraisal_.appraisalDate,
    lastUpdate: Date(),
    status: 'In Process',
    submission_date: '',
    // ----------------------Domain and Teachnology-------------------------------
    Dom_Tech_ER_1: '',
    Dom_Tech_EC_1: '',
    Dom_Tech_MR_1: '',
    Dom_Tech_MC_1: '',
    //---------------------- Understanding function and Technology------------------------------------- 
    Un_fun_ER_1: '',
    Un_fun_EC_1: '',
    Un_fun_MR_1: '',
    Un_fun_MC_1: '',
    //------------------------------Usage of tools-------------------------
    Usage_Tools_ER_1: '',
    Usage_Tools_EC_1: '',
    Usage_Tools_MR_1: '',
    Usage_Tools_MC_1: '',
    // -------------------------Ability to learn Technology------------------------
    Ability_learn_ER_1: '',
    Ability_learn_EC_1: '',
    Ability_learn_MR_1: '',
    Ability_learn_MC_1: '',
    procedure_eqality_ER_2: '',
    procedure_eqality_EC_2: '',
    procedure_eqality_MC_2: '',
    procedure_eqality_MR_2: '',
    problem_finding_skill_ER_2: '',
    problem_finding_skill_EC_2: '',
    problem_finding_skill_MR_2: '',
    problem_finding_skill_MC_2: '',
    contribute_mentor_help_ER_3: '',
    contribute_mentor_help_EC_3: '',
    contribute_mentor_help_MC_3: '',
    contribute_mentor_help_MR_3: '',
    professional_relationship_ER_3: '',
    professional_relationship_EC_3: '',
    professional_relationship_MR_3: '',
    professional_relationship_MC_3: '',
    challenges_responsibility_ER_4: '',
    challenges_responsibility_EC_4: '',
    challenges_responsibility_MR_4: '',
    challenges_responsibility_MC_4: '',
    Ideas_knowledge_ER_4: '',
    Ideas_knowledge_EC_4: '',
    Ideas_knowledge_MR_4: '',
    Ideas_knowledge_MC_4: '',
    Listen_understand_info_ER_5: '',
    Listen_understand_info_EC_5: '',
    Listen_understand_info_MR_5: '',
    Listen_understand_info_MC_5: '',
    info_clear_EC_5: '',
    info_clear_ER_5: '',
    info_clear_MC_5: '',
    info_clear_MR_5: '',
    Plan_Schedules_ER_6: '',
    Plan_Schedules_EC_6: '',
    Plan_Schedules_MR_6: '',
    Plan_Schedules_MC_6: '',
    Effective_work_EC_6: '',
    Effective_work_ER_6: '',
    Effective_work_MR_6: '',
    Effective_work_MC_6: '',
    Management_ER_6: '',
    Management_EC_6: '',
    Management_MC_6: '',
    Management_MR_6: '',
    accomplishment_ER_6: '',
    accomplishment_MR_6: '',
    accomplishment_EC_6: '',
    accomplishment_MC_6: '',
    customer_relationship_EC_7: '',
    customer_relationship_ER_7: '',
    customer_relationship_MC_7: '',
    customer_relationship_MR_7: '',
    Depend_reliability_ER_7: '',
    Depend_reliability_EC_7: '',
    Depend_reliability_MR_7: '',
    Depend_reliability_MC_7: '',
    policies_EC_7: '',
    policies_ER_7: '',
    policies_MR_7: '',
    policies_MC_7: '',
    Resilience_ER_7: '',
    Resilience_EC_7: '',
    Resilience_MC_7: '',
    Resilience_MR_7: '',
    semiannual_EC_8: '',
    semiannual_ER_8: '',
    semiannual_MC_8: '',
    semiannual_MR_8: '',
    semiannual2_EC_8: '',
    semiannual2_ER_8: '',
    semiannual2_MC_8: '',
    semiannual2_MR_8: '',
    EC_10_1_3: '',
    MC_10_1_4: '',
    EC_10_2_3: '',
    MC_10_2_4: '',
    EC_10_3_3: '',
    MC_10_3_4: '',
    EC_10_4_3: '',
    MC_10_4_4: '',
    EC_10_5_3: '',
    MC_10_5_4: '',
    EC_10_6_3: '',
    MC_10_6_4: '',
    EC_10_7_3: '',
    MC_10_7_4: '',
    EC_10_8_3: '',
    MC_10_8_4: '',
    ER_9_1_3: '',
    EC_9_1_4: '',
    MR_9_1_5: '',
    MC_9_1_6: '',
    ER_9_2_3: '',
    EC_9_2_4: '',
    MC_9_2_6: '',
    MR_9_2_5: '',
    ER_9_3_3: '',
    EC_9_3_4: '',
    MC_9_3_6: '',
    MR_9_3_5: '',
    ER_9_4_3: '',
    EC_9_4_4: '',
    MC_9_4_6: '',
    MR_9_4_5: '',
    TER: '',
    TMR: '',
    Taverage: '',
    TavgMR: '',
    EC_over: '',
    MC_over: '',
    total_average_ER1: '',
    total_average_MR1: '',
    total_average_ER2: '',
    total_average_MR2: '',
    createdBy: 'admin.id',
    updatedBy: 'admin.id',
  }).save((err, dbResponse) => {
    if (err) {
      console.log(err);
      return requestFail(res, 500, "something is wrong");
    } else {
      return requestSuccess(res, dbResponse);
    }
  });
}
async function list(req, res) {
  let appraisalEmpl = null;
  try {
    appraisalEmpl = await Appraisal.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  } catch (error) { }
  if (!appraisalEmpl)
    return requestFail(res, "Something went wrong can't get appraisalEmpl");
  return requestSuccess(res, appraisalEmpl);
}
async function update(req, res) {
  try {
    console.log("id  ", req.body.hrName)
    Appraisal.updateOne(
      { aprId: req.params.id },
      {
        $set: {
          reportingperson: req.body.reportingperson,
          reviewingAppraiser: req.body.reviewingAppraiser,
          hrName: req.body.hrName,
          appraisalDate: req.body.appraisalDate,
          updatedBy: 'admin.id',
        },
      },
      (error, result) => {
        if (error) return requestFail(res, "Something went wrong");
        return sendResponse(res, 200, "Update successfully");
      }
    );
  } catch (error) {
    return requestFail(res, 500, "Something went worng");
  }
}
async function appraisalById(req, res) {
  let AppraisalEmpl = null;
  try {
    AppraisalEmpl = await Appraisal.findOne({ aprId: req.params.id });
  } catch (error) {
    console.log(error);
  }
  return requestSuccess(res, AppraisalEmpl);
}
async function EmployeeAppraisalDelete(req, res) {
  let appraisal = null;
  try {
    appraisal = await Appraisal.deleteOne({ aprId: req.body.Id });
  } catch (error) {
    console.log(error);
  }
  return requestSuccess(res, appraisal);
}
module.exports = {
  create,
  list,
  update,
  appraisalById,
  EmployeeAppraisalDelete
};


