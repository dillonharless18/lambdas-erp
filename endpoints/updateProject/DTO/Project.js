class Project {
  constructor(project) {
    this.project_name = project.project_name;
    this.project_code = project.project_code;
    this.material_budget = project.material_budget;
    this.customer_id = project.customer_id;
    this.labor_budget = project.labor_budget;
    this.is_active = project.is_active;
  }
}

export default Project;
