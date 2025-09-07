Rails.application.routes.draw do
  resource :session
  resources :passwords, param: :token

  get "dashboard", to: "dashboard#index"
  resources :companies, only: [ :index, :create, :show, :update ]

  get "inertia-example", to: "inertia_example#index"

  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  root "dashboard#index"
end
