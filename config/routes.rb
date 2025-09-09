Rails.application.routes.draw do
  resource :session
  resources :passwords, param: :token

  get "dashboard", to: "dashboard#index"
  get "calendar", to: "calendar#index"
  patch "calendar/tasks/:id", to: "calendar#update_task", as: :update_calendar_task
  resources :companies, only: [ :index, :create, :show, :update ]
  resources :contacts, only: [ :index, :create, :show, :update ]
  resources :jobs, only: [ :index, :create, :show, :update, :destroy ] do
    member do
      patch :status, to: "jobs#update_status"
      post :toggle_task
    end
    resources :messages, only: [ :create ]
    resources :interviews, only: [ :create ]
    resources :tasks, only: [ :create ]
  end

  get "inertia-example", to: "inertia_example#index"

  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  root "dashboard#index"
end
