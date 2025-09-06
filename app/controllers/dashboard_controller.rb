class DashboardController < ApplicationController
  before_action :require_authentication

  def index
    @companies = [
      {
        id: 1,
        company: "TechCorp Solutions",
        url: "https://techcorp.com",
        offer_url: "https://techcorp.com/careers/senior-developer"
      },
      {
        id: 2,
        company: "InnovateLabs",
        url: "https://innovatelabs.io",
        offer_url: "https://innovatelabs.io/jobs/fullstack-engineer"
      },
      {
        id: 3,
        company: "DataFlow Systems",
        url: "https://dataflow.systems",
        offer_url: "https://dataflow.systems/careers/backend-developer"
      },
      {
        id: 4,
        company: "CloudTech Inc",
        url: "https://cloudtech.com",
        offer_url: "https://cloudtech.com/jobs/devops-engineer"
      },
      {
        id: 5,
        company: "StartupXYZ",
        url: "https://startupxyz.com",
        offer_url: "https://startupxyz.com/careers/frontend-developer"
      }
    ]

    render inertia: "Dashboard", props: {
      companies: @companies
    }
  end
end
