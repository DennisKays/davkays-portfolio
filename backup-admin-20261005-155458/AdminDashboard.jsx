import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Pencil,
  Plus,
  Save,
  Settings,
  Star,
  Trash2,
  Upload,
  Wrench,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const emptyProject = {
  number: "",
  category: "",
  status: "Planned",
  title: "",
  description: "",
  technologies: "",
  link: "",
  image_url: "",
  featured: false,
};

const emptyService = {
  title: "",
  description: "",
  active: true,
};

const emptyTestimonial = {
  name: "",
  company: "",
  role: "",
  message: "",
  image_url: "",
  published: true,
};

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [leads, setLeads] = useState([]);
  const [assets, setAssets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [settings, setSettings] = useState(null);

  const [projectForm, setProjectForm] = useState(emptyProject);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);

  const [editingProject, setEditingProject] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const nav = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: BriefcaseBusiness },
    { id: "leads", label: "Leads", icon: MessageSquare },
    { id: "services", label: "Services", icon: Wrench },
    { id: "testimonials", label: "Testimonials", icon: Star },
    { id: "media", label: "Media & CV", icon: Image },
    { id: "settings", label: "Business Settings", icon: Settings },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  async function logActivity(action, entityType = "", entityId = "", details = "") {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("activity_logs").insert({
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      user_id: user.id,
    });
  }

  async function loadAll() {
    setLoading(true);

    const [
      projectResult,
      serviceResult,
      testimonialResult,
      leadResult,
      assetResult,
      settingsResult,
      activityResult,
    ] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("site_assets").select("*").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(50),
    ]);

    setProjects(projectResult.data || []);
    setServices(serviceResult.data || []);
    setTestimonials(testimonialResult.data || []);
    setLeads(leadResult.data || []);
    setAssets(assetResult.data || []);
    setSettings(settingsResult.data || null);
    setActivities(activityResult.data || []);

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  function flash(message) {
    setNotice(message);
    setTimeout(() => setNotice(""), 3000);
  }

  async function saveProject(event) {
    event.preventDefault();
    setSaving(true);

    const payload = {
      number: projectForm.number,
      category: projectForm.category,
      status: projectForm.status,
      title: projectForm.title,
      description: projectForm.description,
      technologies: projectForm.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      link: projectForm.link,
      image_url: projectForm.image_url,
      featured: projectForm.featured,
      updated_at: new Date().toISOString(),
    };

    const result = editingProject
      ? await supabase.from("projects").update(payload).eq("id", editingProject)
      : await supabase.from("projects").insert(payload);

    if (result.error) {
      flash(result.error.message);
    } else {
      await logActivity(
        editingProject ? "Updated project" : "Created project",
        "project",
        editingProject || "",
        projectForm.title
      );

      flash(editingProject ? "Project updated." : "Project created.");
      setProjectForm(emptyProject);
      setEditingProject(null);
      setShowProjectForm(false);
      await loadAll();
    }

    setSaving(false);
  }

  function editProject(project) {
    setEditingProject(project.id);
    setProjectForm({
      ...project,
      technologies: (project.technologies || []).join(", "),
    });
    setShowProjectForm(true);
    setActiveSection("projects");
  }

  async function deleteProject(id) {
    if (!window.confirm("Delete this project permanently?")) return;

    const result = await supabase.from("projects").delete().eq("id", id);

    if (result.error) {
      flash(result.error.message);
      return;
    }

    await logActivity("Deleted project", "project", id);
    flash("Project deleted.");
    await loadAll();
  }

  async function saveService(event) {
    event.preventDefault();
    setSaving(true);

    const payload = {
      title: serviceForm.title,
      description: serviceForm.description,
      active: serviceForm.active,
      updated_at: new Date().toISOString(),
    };

    const result = editingService
      ? await supabase.from("services").update(payload).eq("id", editingService)
      : await supabase.from("services").insert({
          ...payload,
          sort_order: services.length + 1,
        });

    if (result.error) {
      flash(result.error.message);
    } else {
      await logActivity(
        editingService ? "Updated service" : "Created service",
        "service",
        editingService || "",
        serviceForm.title
      );

      flash(editingService ? "Service updated." : "Service created.");
      setServiceForm(emptyService);
      setEditingService(null);
      setShowServiceForm(false);
      await loadAll();
    }

    setSaving(false);
  }

  function editService(service) {
    setEditingService(service.id);
    setServiceForm({
      title: service.title,
      description: service.description,
      active: service.active,
    });
    setShowServiceForm(true);
  }

  async function deleteService(id) {
    if (!window.confirm("Delete this service?")) return;

    const result = await supabase.from("services").delete().eq("id", id);

    if (result.error) {
      flash(result.error.message);
      return;
    }

    await logActivity("Deleted service", "service", id);
    flash("Service deleted.");
    await loadAll();
  }

  async function saveTestimonial(event) {
    event.preventDefault();
    setSaving(true);

    const payload = {
      name: testimonialForm.name,
      company: testimonialForm.company,
      role: testimonialForm.role,
      message: testimonialForm.message,
      image_url: testimonialForm.image_url,
      published: testimonialForm.published,
      updated_at: new Date().toISOString(),
    };

    const result = editingTestimonial
      ? await supabase.from("testimonials").update(payload).eq("id", editingTestimonial)
      : await supabase.from("testimonials").insert(payload);

    if (result.error) {
      flash(result.error.message);
    } else {
      await logActivity(
        editingTestimonial ? "Updated testimonial" : "Created testimonial",
        "testimonial",
        editingTestimonial || "",
        testimonialForm.name
      );

      flash(editingTestimonial ? "Testimonial updated." : "Testimonial created.");
      setTestimonialForm(emptyTestimonial);
      setEditingTestimonial(null);
      setShowTestimonialForm(false);
      await loadAll();
    }

    setSaving(false);
  }

  function editTestimonial(item) {
    setEditingTestimonial(item.id);
    setTestimonialForm({
      name: item.name,
      company: item.company,
      role: item.role,
      message: item.message,
      image_url: item.image_url,
      published: item.published,
    });
    setShowTestimonialForm(true);
  }

  async function deleteTestimonial(id) {
    if (!window.confirm("Delete this testimonial?")) return;

    const result = await supabase.from("testimonials").delete().eq("id", id);

    if (result.error) {
      flash(result.error.message);
      return;
    }

    await logActivity("Deleted testimonial", "testimonial", id);
    flash("Testimonial deleted.");
    await loadAll();
  }

  async function updateLeadStatus(id, status) {
    const result = await supabase
      .from("leads")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (result.error) {
      flash(result.error.message);
      return;
    }

    await logActivity("Updated lead status", "lead", id, status);
    await loadAll();
  }

  async function deleteLead(id) {
    if (!window.confirm("Delete this lead?")) return;

    const result = await supabase.from("leads").delete().eq("id", id);

    if (result.error) {
      flash(result.error.message);
      return;
    }

    await logActivity("Deleted lead", "lead", id);
    flash("Lead deleted.");
    await loadAll();
  }

  async function uploadAsset(event, assetType) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSaving(true);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${assetType}/${Date.now()}-${safeName}`;

    const upload = await supabase.storage
      .from("portfolio-assets")
      .upload(path, file, {
        upsert: false,
      });

    if (upload.error) {
      flash(upload.error.message);
      setSaving(false);
      return;
    }

    const { data } = supabase.storage
      .from("portfolio-assets")
      .getPublicUrl(path);

    const asset = await supabase.from("site_assets").insert({
      asset_type: assetType,
      name: file.name,
      url: data.publicUrl,
    }).select().single();

    if (asset.error) {
      flash(asset.error.message);
    } else {
      await logActivity("Uploaded file", "asset", asset.data.id, file.name);
      flash("File uploaded.");
      await loadAll();
    }

    setSaving(false);
    event.target.value = "";
  }

  async function deleteAsset(asset) {
    if (!window.confirm(`Delete ${asset.name}?`)) return;

    const url = asset.url;
    const marker = "/portfolio-assets/";
    const index = url.indexOf(marker);

    if (index !== -1) {
      const path = decodeURIComponent(url.substring(index + marker.length));
      await supabase.storage.from("portfolio-assets").remove([path]);
    }

    await supabase.from("site_assets").delete().eq("id", asset.id);

    await logActivity("Deleted file", "asset", asset.id, asset.name);
    flash("File deleted.");
    await loadAll();
  }

  async function setCurrentCV(asset) {
    if (!settings) return;

    const result = await supabase
      .from("site_settings")
      .update({
        current_cv_url: asset.url,
        current_cv_name: asset.name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (result.error) {
      flash(result.error.message);
      return;
    }

    await logActivity("Changed current CV", "asset", asset.id, asset.name);
    flash("Current CV updated.");
    await loadAll();
  }

  async function saveSettings(event) {
    event.preventDefault();

    if (!settings) return;

    setSaving(true);

    const result = await supabase
      .from("site_settings")
      .update({
        ...settings,
        id: 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (result.error) {
      flash(result.error.message);
    } else {
      await logActivity("Updated business settings", "settings", "1");
      flash("Business settings saved.");
      await loadAll();
    }

    setSaving(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/admin";
  }

  const stats = useMemo(() => ({
    projects: projects.length,
    completed: projects.filter((p) => p.status === "Completed").length,
    leads: leads.length,
    newLeads: leads.filter((l) => l.status === "New").length,
    services: services.filter((s) => s.active).length,
    testimonials: testimonials.filter((t) => t.published).length,
  }), [projects, leads, services, testimonials]);

  function renderOverview() {
    return (
      <>
        <div className="admin-page-heading">
          <div>
            <span className="section-label">Business Control Center</span>
            <h1>Good to see you.</h1>
            <p>Manage your DavKays business from one place.</p>
          </div>
        </div>

        <div className="admin-stat-grid">
          <Stat icon={BriefcaseBusiness} label="Projects" value={stats.projects} />
          <Stat icon={Check} label="Completed" value={stats.completed} />
          <Stat icon={MessageSquare} label="Total Leads" value={stats.leads} />
          <Stat icon={BarChart3} label="New Leads" value={stats.newLeads} />
          <Stat icon={Wrench} label="Active Services" value={stats.services} />
          <Stat icon={Star} label="Testimonials" value={stats.testimonials} />
        </div>

        <div className="admin-overview-grid">
          <div className="admin-card">
            <div className="admin-card-heading">
              <div>
                <span className="admin-card-kicker">Pipeline</span>
                <h2>Recent enquiries</h2>
              </div>
              <button
                className="admin-text-button"
                onClick={() => setActiveSection("leads")}
              >
                View all
              </button>
            </div>

            {leads.slice(0, 5).map((lead) => (
              <div className="admin-list-row" key={lead.id}>
                <div>
                  <strong>{lead.name}</strong>
                  <span>{lead.project_type || "General enquiry"}</span>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))}

            {!leads.length && (
              <div className="admin-empty">No enquiries yet.</div>
            )}
          </div>

          <div className="admin-card">
            <div className="admin-card-heading">
              <div>
                <span className="admin-card-kicker">Portfolio</span>
                <h2>Recent projects</h2>
              </div>
              <button
                className="admin-text-button"
                onClick={() => setActiveSection("projects")}
              >
                Manage
              </button>
            </div>

            {projects.slice(0, 5).map((project) => (
              <div className="admin-list-row" key={project.id}>
                <div>
                  <strong>{project.title}</strong>
                  <span>{project.category}</span>
                </div>
                <StatusBadge status={project.status} />
              </div>
            ))}

            {!projects.length && (
              <div className="admin-empty">No projects yet.</div>
            )}
          </div>
        </div>
      </>
    );
  }

  function renderProjects() {
    return (
      <>
        <PageHeading
          label="Portfolio"
          title="Projects"
          description="Control the work displayed on your public portfolio."
          action={
            <button
              className="button button-primary"
              onClick={() => {
                setProjectForm(emptyProject);
                setEditingProject(null);
                setShowProjectForm(true);
              }}
            >
              <Plus size={17} /> Add Project
            </button>
          }
        />

        {showProjectForm && (
          <FormCard
            title={editingProject ? "Edit Project" : "New Project"}
            onClose={() => {
              setShowProjectForm(false);
              setEditingProject(null);
            }}
          >
            <form className="admin-form-grid" onSubmit={saveProject}>
              <Field label="Project title">
                <input
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  required
                />
              </Field>

              <Field label="Category">
                <input
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  placeholder="Business Software"
                  required
                />
              </Field>

              <Field label="Project number">
                <input
                  value={projectForm.number}
                  onChange={(e) => setProjectForm({ ...projectForm, number: e.target.value })}
                  placeholder="04"
                  required
                />
              </Field>

              <Field label="Status">
                <select
                  value={projectForm.status}
                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                >
                  <option>Planned</option>
                  <option>Concept</option>
                  <option>In Development</option>
                  <option>Completed</option>
                </select>
              </Field>

              <Field label="Technologies" wide>
                <input
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  placeholder="React, Python, SQLite"
                />
              </Field>

              <Field label="Project link" wide>
                <input
                  value={projectForm.link}
                  onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                  placeholder="https://..."
                />
              </Field>

              <Field label="Image URL" wide>
                <input
                  value={projectForm.image_url}
                  onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                  placeholder="Upload through Media, then paste URL"
                />
              </Field>

              <Field label="Description" wide>
                <textarea
                  rows="5"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  required
                />
              </Field>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                />
                Featured project
              </label>

              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={saving}
                >
                  <Save size={17} /> {saving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </FormCard>
        )}

        <div className="admin-table-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <strong>{project.title}</strong>
                      <span>{project.number}</span>
                    </td>
                    <td>{project.category}</td>
                    <td><StatusBadge status={project.status} /></td>
                    <td>{project.featured ? "Yes" : "No"}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button onClick={() => editProject(project)} title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => deleteProject(project.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!projects.length && (
              <div className="admin-empty">No projects in your database yet.</div>
            )}
          </div>
        </div>
      </>
    );
  }

  function renderLeads() {
    return (
      <>
        <PageHeading
          label="Sales Pipeline"
          title="Leads & Enquiries"
          description="Track people who contact DavKays about software projects."
        />

        <div className="lead-pipeline">
          {["New", "Contacted", "In Discussion", "Won", "Lost"].map((status) => (
            <div className="pipeline-stage" key={status}>
              <div className="pipeline-stage-header">
                <span>{status}</span>
                <strong>{leads.filter((l) => l.status === status).length}</strong>
              </div>

              {leads
                .filter((lead) => lead.status === status)
                .map((lead) => (
                  <div className="lead-card" key={lead.id}>
                    <strong>{lead.name}</strong>
                    <span>{lead.company || "Independent client"}</span>
                    <small>{lead.project_type || "General enquiry"}</small>
                    <p>{lead.message}</p>

                    <div className="lead-card-footer">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>In Discussion</option>
                        <option>Won</option>
                        <option>Lost</option>
                      </select>

                      <button onClick={() => deleteLead(lead.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderServices() {
    return (
      <>
        <PageHeading
          label="Offerings"
          title="Services"
          description="Manage the services displayed by DavKays."
          action={
            <button
              className="button button-primary"
              onClick={() => {
                setServiceForm(emptyService);
                setEditingService(null);
                setShowServiceForm(true);
              }}
            >
              <Plus size={17} /> Add Service
            </button>
          }
        />

        {showServiceForm && (
          <FormCard
            title={editingService ? "Edit Service" : "New Service"}
            onClose={() => setShowServiceForm(false)}
          >
            <form className="admin-form-grid" onSubmit={saveService}>
              <Field label="Service title">
                <input
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  required
                />
              </Field>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={serviceForm.active}
                  onChange={(e) => setServiceForm({ ...serviceForm, active: e.target.checked })}
                />
                Visible on website
              </label>

              <Field label="Description" wide>
                <textarea
                  rows="4"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  required
                />
              </Field>

              <div className="admin-form-actions">
                <button className="button button-primary" disabled={saving}>
                  <Save size={17} /> Save Service
                </button>
              </div>
            </form>
          </FormCard>
        )}

        <div className="admin-content-grid">
          {services.map((service) => (
            <div className="admin-content-card" key={service.id}>
              <div className="admin-content-card-top">
                <span className={service.active ? "live-dot" : "offline-dot"} />
                <span>{service.active ? "Published" : "Hidden"}</span>
              </div>

              <h3>{service.title}</h3>
              <p>{service.description}</p>

              <div className="admin-card-actions">
                <button onClick={() => editService(service)}>
                  <Pencil size={15} /> Edit
                </button>
                <button onClick={() => deleteService(service.id)}>
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderTestimonials() {
    return (
      <>
        <PageHeading
          label="Social Proof"
          title="Testimonials"
          description="Manage client feedback and recommendations."
          action={
            <button
              className="button button-primary"
              onClick={() => {
                setTestimonialForm(emptyTestimonial);
                setEditingTestimonial(null);
                setShowTestimonialForm(true);
              }}
            >
              <Plus size={17} /> Add Testimonial
            </button>
          }
        />

        {showTestimonialForm && (
          <FormCard
            title={editingTestimonial ? "Edit Testimonial" : "New Testimonial"}
            onClose={() => setShowTestimonialForm(false)}
          >
            <form className="admin-form-grid" onSubmit={saveTestimonial}>
              <Field label="Client name">
                <input
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  required
                />
              </Field>

              <Field label="Company">
                <input
                  value={testimonialForm.company}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                />
              </Field>

              <Field label="Role">
                <input
                  value={testimonialForm.role}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                />
              </Field>

              <Field label="Photo URL">
                <input
                  value={testimonialForm.image_url}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, image_url: e.target.value })}
                />
              </Field>

              <Field label="Message" wide>
                <textarea
                  rows="5"
                  value={testimonialForm.message}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, message: e.target.value })}
                  required
                />
              </Field>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={testimonialForm.published}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, published: e.target.checked })}
                />
                Publish testimonial
              </label>

              <div className="admin-form-actions">
                <button className="button button-primary" disabled={saving}>
                  <Save size={17} /> Save Testimonial
                </button>
              </div>
            </form>
          </FormCard>
        )}

        <div className="admin-content-grid">
          {testimonials.map((item) => (
            <div className="admin-content-card" key={item.id}>
              <div className="testimonial-admin-stars">★★★★★</div>
              <p className="testimonial-admin-message">“{item.message}”</p>
              <strong>{item.name}</strong>
              <span>{item.role}{item.company ? ` · ${item.company}` : ""}</span>

              <div className="admin-card-actions">
                <button onClick={() => editTestimonial(item)}>
                  <Pencil size={15} /> Edit
                </button>
                <button onClick={() => deleteTestimonial(item.id)}>
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderMedia() {
    const cvs = assets.filter((asset) => asset.asset_type === "cv");
    const images = assets.filter((asset) => asset.asset_type !== "cv");

    return (
      <>
        <PageHeading
          label="Digital Assets"
          title="Media & CV"
          description="Manage portfolio images and your public CV."
        />

        <div className="upload-grid">
          <div className="upload-card">
            <FileText size={25} />
            <h3>Upload CV</h3>
            <p>Upload a new PDF CV to your portfolio.</p>
            <label className="button button-primary upload-label">
              <Upload size={17} /> Choose CV
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => uploadAsset(e, "cv")}
                hidden
              />
            </label>
          </div>

          <div className="upload-card">
            <Image size={25} />
            <h3>Upload Image</h3>
            <p>Upload project, branding or portfolio images.</p>
            <label className="button button-primary upload-label">
              <Upload size={17} /> Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadAsset(e, "image")}
                hidden
              />
            </label>
          </div>
        </div>

        <div className="admin-section-title">
          <h2>CV Library</h2>
          <span>{cvs.length} files</span>
        </div>

        <div className="asset-grid">
          {cvs.map((asset) => (
            <div className="asset-card" key={asset.id}>
              <FileText size={22} />
              <div>
                <strong>{asset.name}</strong>
                <span>{settings?.current_cv_url === asset.url ? "Current CV" : "Archived"}</span>
              </div>

              <div className="asset-actions">
                <a href={asset.url} target="_blank" rel="noreferrer">
                  View
                </a>
                {settings?.current_cv_url !== asset.url && (
                  <button onClick={() => setCurrentCV(asset)}>Use</button>
                )}
                <button onClick={() => deleteAsset(asset)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-section-title">
          <h2>Image Library</h2>
          <span>{images.length} files</span>
        </div>

        <div className="asset-grid">
          {images.map((asset) => (
            <div className="asset-card" key={asset.id}>
              <Image size={22} />
              <div>
                <strong>{asset.name}</strong>
                <span>{asset.asset_type}</span>
              </div>

              <div className="asset-actions">
                <a href={asset.url} target="_blank" rel="noreferrer">
                  View
                </a>
                <button onClick={() => deleteAsset(asset)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderSettings() {
    if (!settings) return <div className="admin-empty">Loading settings...</div>;

    return (
      <>
        <PageHeading
          label="Business Configuration"
          title="Settings"
          description="Control your public business information."
        />

        <form className="admin-settings-card" onSubmit={saveSettings}>
          <div className="admin-settings-section">
            <h2>Business Identity</h2>

            <div className="admin-form-grid">
              <Field label="Business name">
                <input
                  value={settings.business_name}
                  onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                />
              </Field>

              <Field label="Tagline">
                <input
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                />
              </Field>

              <Field label="Email">
                <input
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </Field>

              <Field label="Phone">
                <input
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </Field>

              <Field label="WhatsApp">
                <input
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                />
              </Field>

              <Field label="LinkedIn">
                <input
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                />
              </Field>
            </div>
          </div>

          <div className="admin-settings-section">
            <h2>Homepage Content</h2>

            <div className="admin-form-grid">
              <Field label="Hero title" wide>
                <input
                  value={settings.hero_title}
                  onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                />
              </Field>

              <Field label="Hero description" wide>
                <textarea
                  rows="4"
                  value={settings.hero_description}
                  onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                />
              </Field>

              <Field label="About text" wide>
                <textarea
                  rows="6"
                  value={settings.about_text}
                  onChange={(e) => setSettings({ ...settings, about_text: e.target.value })}
                />
              </Field>

              <Field label="Skills" wide>
                <textarea
                  rows="4"
                  value={(settings.skills || []).join(", ")}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      skills: e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="React, JavaScript, Python, FastAPI..."
                />
              </Field>
            </div>
          </div>

          <button className="button button-primary" disabled={saving}>
            <Save size={17} /> {saving ? "Saving..." : "Save Business Settings"}
          </button>
        </form>
      </>
    );
  }

  function renderActivity() {
    return (
      <>
        <PageHeading
          label="Audit Trail"
          title="Activity"
          description="Recent changes made through your business dashboard."
        />

        <div className="activity-list">
          {activities.map((item) => (
            <div className="activity-row" key={item.id}>
              <div className="activity-icon">
                <Activity size={16} />
              </div>
              <div>
                <strong>{item.action}</strong>
                <span>{item.details || item.entity_type}</span>
              </div>
              <time>{new Date(item.created_at).toLocaleString()}</time>
            </div>
          ))}

          {!activities.length && (
            <div className="admin-empty">No activity recorded yet.</div>
          )}
        </div>
      </>
    );
  }

  function renderContent() {
    if (loading) {
      return <div className="admin-loading">Loading business data...</div>;
    }

    if (activeSection === "overview") return renderOverview();
    if (activeSection === "projects") return renderProjects();
    if (activeSection === "leads") return renderLeads();
    if (activeSection === "services") return renderServices();
    if (activeSection === "testimonials") return renderTestimonials();
    if (activeSection === "media") return renderMedia();
    if (activeSection === "settings") return renderSettings();
    if (activeSection === "activity") return renderActivity();

    return null;
  }

  return (
    <div className="business-admin">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">DK</div>
          <div>
            <strong>DavKays</strong>
            <span>Business Control</span>
          </div>
        </div>

        <nav className="admin-nav">
          <span className="admin-nav-label">Workspace</span>

          {nav.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={activeSection === item.id ? "active" : ""}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon size={17} />
                {item.label}

                {item.id === "leads" && stats.newLeads > 0 && (
                  <b>{stats.newLeads}</b>
                )}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer">
            View live website
          </a>

          <button onClick={logout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>DAVKAYS / ADMIN</span>
          </div>

          <div className="admin-topbar-status">
            <i />
            System online
          </div>
        </header>

        <div className="admin-content">
          {notice && <div className="admin-notice">{notice}</div>}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon">
        <Icon size={19} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PageHeading({ label, title, description, action }) {
  return (
    <div className="admin-page-heading">
      <div>
        <span className="section-label">{label}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function FormCard({ title, onClose, children }) {
  return (
    <div className="admin-form-card">
      <div className="admin-form-card-heading">
        <h2>{title}</h2>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children, wide = false }) {
  return (
    <label className={wide ? "admin-field admin-field-wide" : "admin-field"}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status.toLowerCase().replace(/\s+/g, "-")}`}>{status}</span>;
}

export default AdminDashboard;
