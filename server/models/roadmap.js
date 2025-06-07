import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["locked", "available", "in_progress", "completed"],
    default: "locked"
  },
  order: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["knowledge", "project", "assessment", "skill_building"],
    required: true
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  }],
  requiredSkills: [{
    skill: String,
    minimumProficiency: Number
  }],
  unlockConditions: {
    requiredMilestones: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone"
    }],
    minimumLevel: {
      type: Number,
      default: 1
    }
  },
  rewards: {
    experience: Number,
    skills: [{
      skill: String,
      points: Number
    }],
    achievements: [{
      title: String,
      description: String,
      icon: String
    }]
  },
  content: {
    overview: String,
    steps: [String],
    resources: [{
      title: String,
      url: String,
      type: String // video, article, course, etc.
    }]
  },
  estimatedTime: String,
  difficulty: {
    type: Number,
    min: 1,
    max: 5
  }
});

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  goal: String,
  milestones: [milestoneSchema],
  currentMilestone: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Roadmap = mongoose.model("Roadmap", roadmapSchema);
export default Roadmap;