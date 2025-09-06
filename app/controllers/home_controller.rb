class HomeController < ApplicationController
  def index
    render inertia: 'HelloWorld'
  end
end
