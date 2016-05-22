require 'faraday'
class ProxyController < ApplicationController
  rescue_from Exception do |exception|
    data = MultiJson.load(open('test/index.json'))
    response.headers['Access-Control-Allow-Origin'] = '*'
    render :json => data
  end

  def index
    data = get_articles

    response.headers['Access-Control-Allow-Origin'] = '*'
    render :json => data
  end

  def get_articles(query = nil)
    pry
    response = getting_articles_with_retry_because_the_solr_is_not_ha_because_it_costs query
    response.is_a? Hash ? response : MultiJson.load(response.body)
  rescue
    MultiJson.load(open('test/index.json'))
  end

  private
    def getting_articles_with_retry_because_the_solr_is_not_ha_because_it_costs query
      query ||= params.select{|k,_| k.to_sym == :q}

      connection = Faraday.new(url: "http://hacktm.ness.ro:8983/solr/article/select") do |c|
        c.request :retry, max: 2, interval: 0.05, interval_randomness: 0.5, backoff_factor: 2
        c.use Faraday::Request::UrlEncoded
        c.response :detailed_logger, Rails.logger
        c.use Faraday::Adapter::NetHttp
        c.use FaradayMiddleware::ParseJson,       content_type: 'application/json'
        c.use Faraday::Response::RaiseError
      end

      connection.get {|req| req.params = {wt: :json}.merge query}
    end
end
