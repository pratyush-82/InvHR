const mongoose = require("mongoose");
const appraisalSchema = new mongoose.Schema({
  aprId: {
    type: String,
  },
  employeeId: {
    type: String,
  },
  employeeName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  designation: {
    type: String,
  },

  totalExperience: {
    type: String,
  },
  inevitableExperience: {
    type: String,
  },

  reportingperson: {
    type: String,
  },
  reviewingAppraiser: {
    type: String,
  },
  hrName: {
    type: String,
  },
  dateOfJoining: {
    type: Date,
  },
  appraisalDate: {
    type: Date,
  },
  lastUpdate: {
    type: Date,
  },
  status: {
    type: String,
  },
  submission_date: {
    type: String,
  },
  // ----------------------Domain and Teachnology-------------------------------
  Dom_Tech_ER_1: Number,
  Dom_Tech_EC_1: {
    type: String,
  },
  Dom_Tech_MR_1: Number,
  Dom_Tech_MC_1: {
    type: String,
  },
  //---------------------- Understanding function and Technology------------------------------------- 
  Un_fun_ER_1: Number,
  Un_fun_EC_1: {
    type: String,
  },
  Un_fun_MR_1: Number,
  Un_fun_MC_1: {
    type: String,
  },
  //------------------------------Usage of tools-------------------------
  Usage_Tools_ER_1: Number,
  Usage_Tools_EC_1: {
    type: String,
  },
  Usage_Tools_MR_1: Number,
  Usage_Tools_MC_1: {
    type: String,
  },
  // -------------------------Ability to learn Technology------------------------
  Ability_learn_ER_1: Number,
  Ability_learn_EC_1: {
    type: String,
  },
  Ability_learn_MR_1: Number,
  Ability_learn_MC_1: {
    type: String,
  },

  procedure_eqality_ER_2: Number,
  procedure_eqality_EC_2: {
    type: String,
  },
  procedure_eqality_MC_2: {
    type: String,
  },
  procedure_eqality_MR_2: Number,



  problem_finding_skill_ER_2: Number,
  problem_finding_skill_EC_2: {
    type: String,
  },
  problem_finding_skill_MR_2: Number,
  problem_finding_skill_MC_2: {
    type: String,
  },


  contribute_mentor_help_ER_3: Number,
  contribute_mentor_help_EC_3: {
    type: String,
  },
  contribute_mentor_help_MC_3: {
    type: String,
  },
  contribute_mentor_help_MR_3: Number,

  professional_relationship_ER_3: Number,
  professional_relationship_EC_3: {
    type: String,
  },
  professional_relationship_MR_3: Number,
  professional_relationship_MC_3: {
    type: String,
  },



  challenges_responsibility_ER_4: Number,
  challenges_responsibility_EC_4: {
    type: String,
  },
  challenges_responsibility_MR_4: Number,
  challenges_responsibility_MC_4: {
    type: String,
  },

  Ideas_knowledge_ER_4: Number,
  Ideas_knowledge_EC_4: {
    type: String,
  },
  Ideas_knowledge_MR_4: Number,
  Ideas_knowledge_MC_4: {
    type: String,
  },

  Listen_understand_info_ER_5: Number,
  Listen_understand_info_EC_5: {
    type: String,
  },
  Listen_understand_info_MR_5: Number,
  Listen_understand_info_MC_5: {
    type: String,
  },

  info_clear_EC_5: {
    type: String,
  },
  info_clear_ER_5: Number,
  info_clear_MC_5: {
    type: String,
  },
  info_clear_MR_5: Number,

  Plan_Schedules_ER_6: Number,
  Plan_Schedules_EC_6: {
    type: String,
  },
  Plan_Schedules_MR_6: Number,
  Plan_Schedules_MC_6: {
    type: String,
  },


  Effective_work_EC_6: {
    type: String,
  },
  Effective_work_ER_6: Number,
  Effective_work_MR_6: Number,
  Effective_work_MC_6: {
    type: String,
  },

  Management_ER_6: Number,
  Management_EC_6: {
    type: String,
  },
  Management_MC_6: {
    type: String,
  },
  Management_MR_6: Number,

  accomplishment_ER_6: Number,
  accomplishment_MR_6: Number,
  accomplishment_EC_6: {
    type: String,
  },
  accomplishment_MC_6: {
    type: String,
  },


  customer_relationship_EC_7: {
    type: String,
  },
  customer_relationship_ER_7: Number,
  customer_relationship_MC_7: {
    type: String,
  },
  customer_relationship_MR_7: Number,

  Depend_reliability_ER_7: Number,
  Depend_reliability_EC_7: {
    type: String,
  },
  Depend_reliability_MR_7: Number,
  Depend_reliability_MC_7: {
    type: String,
  },

  policies_EC_7: {
    type: String,
  },
  policies_ER_7: Number,
  policies_MR_7: Number,
  policies_MC_7: {
    type: String,
  },
  Resilience_ER_7: Number,
  Resilience_EC_7: {
    type: String,
  },
  Resilience_MC_7: {
    type: String,
  },
  Resilience_MR_7: Number,
  semiannual_EC_8: {
    type: String,
  },
  semiannual_ER_8: Number,
  semiannual_MC_8: {
    type: String,
  },
  semiannual_MR_8: Number,
  semiannual2_EC_8: {
    type: String,
  },
  semiannual2_ER_8: Number,
  semiannual2_MC_8: {
    type: String,
  },
  semiannual2_MR_8: Number,
  EC_10_1_3: {
    type: String,
  },
  MC_10_1_4: {
    type: String,
  },
  EC_10_2_3: {
    type: String,
  },
  MC_10_2_4: {
    type: String,
  },
  EC_10_3_3: {
    type: String,
  },
  MC_10_3_4: {
    type: String,
  },
  EC_10_4_3: {
    type: String,
  },
  MC_10_4_4: {
    type: String,
  },
  EC_10_5_3: {
    type: String,
  },
  MC_10_5_4: {
    type: String,
  },
  EC_10_6_3: {
    type: String,
  },
  MC_10_6_4: {
    type: String,
  },
  EC_10_7_3: {
    type: String,
  },
  MC_10_7_4: {
    type: String,
  },
  EC_10_8_3: {
    type: String,
  },
  MC_10_8_4: {
    type: String,
  },
  ER_9_1_3: {
    type: String,
  },
  EC_9_1_4: {
    type: String,
  },
  MR_9_1_5: {
    type: String,
  },
  MC_9_1_6: {
    type: String,
  },
  ER_9_2_3: {
    type: String,
  },
  EC_9_2_4: {
    type: String,
  },
  MC_9_2_6: {
    type: String,
  },
  MR_9_2_5: {
    type: String,
  },
  ER_9_3_3: {
    type: String,
  },
  EC_9_3_4: {
    type: String,
  },
  MC_9_3_6: {
    type: String,
  },
  MR_9_3_5: {
    type: String,
  },
  ER_9_4_3: {
    type: String,
  },
  EC_9_4_4: {
    type: String,
  },
  MC_9_4_6: {
    type: String,
  },
  MR_9_4_5: {
    type: String,
  },
  TER: {
    type: String,
  },
  TMR: {
    type: String,
  },
  Taverage: {
    type: String,
  },
  TavgMR: {
    type: String,
  },
  EC_over: {
    type: String,
  },
  MC_over: {
    type: String,
  },
  total_average_ER1: Number,
  total_average_MR1: Number,
  total_average_ER2: Number,
  total_average_MR2: Number,
})
const Appraisal = new mongoose.model("AppraisalInfo", appraisalSchema);

module.exports = Appraisal;
