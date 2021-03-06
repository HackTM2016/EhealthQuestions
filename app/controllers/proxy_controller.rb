require 'faraday'
class ProxyController < ApplicationController
  rescue_from Exception do |exception|
    puts exception
    puts exception.backtrace
    data = MultiJson.load(open('test/index.json'), symbolize_keys: true)
    response.headers['Access-Control-Allow-Origin'] = '*'
    render :json => data
  end

  def index
    data = load_json
    response.headers['Access-Control-Allow-Origin'] = '*'
    if no_data_found_but_stale_data_allowed?(data)
      data = MultiJson.load(open('test/index.json'), symbolize_keys: true)
    end
    render :json => data
  end

  def d3dataformatter
    only_q_params
    @q_params = {q: URI.encode(@q_params[:q])} if @q_params && @q_params[:q]
    data = load_json

    response.headers['Access-Control-Allow-Origin'] = '*'
    if no_data_found_but_stale_data_allowed?(data)
      data = MultiJson.load(open('test/index.json'), symbolize_keys: true)
    end

    children = data[:response][:docs].map{ |e| {name: e[:journalTitle], children: []} }
    render :json => {name: only_q_params[:q], children: children }
  end

  def d3show
    render :drill
  end

  def get_articles(query = nil)
    begin
      getting_articles_with_retry_because_the_solr_is_not_ha_because_it_costs(query).body
    rescue Exception => e
      Rails.logger.error e
      open('test/index.json')
    end
  end

  private

    def load_json
      MultiJson.load(get_articles, symbolize_keys: true)
    end

    def no_data_found_but_stale_data_allowed?(data)
      params[:stale_data] == true && (data.nil? || data[:response][:numFound] == 0) && params[:stale_data]
    end

    def get_articles_docs
      get_docs load_json
    end

    def get_docs(data)
      data_docs = data[:response] if data
      data_docs = data[:docs] if data_docs
      data_docs
    end

  def getting_articles_with_retry_because_the_solr_is_not_ha_because_it_costs query
      query ||= only_q_params

      connection = Faraday.new(url: "http://hacktm.ness.ro:8983/solr/pubmed/select") do |c|
        c.request :retry, max: 2, interval: 0.05, interval_randomness: 0.5, backoff_factor: 2
        c.use Faraday::Request::UrlEncoded
        c.response :detailed_logger, Rails.logger
        c.use Faraday::Adapter::NetHttp
        c.use FaradayMiddleware::ParseJson, content_type: :json
        c.use Faraday::Response::RaiseError
      end

      connection.get {|req| req.params = {wt: :json}.merge query}
    end

  def only_q_params
    unless @q_params
      @q_params = params.select { |k, _| k.to_sym == :q }
    end
    @q_params
    # if @q_params
    #   value = @q_params[:q]
    #   {q: value.downcase.gsub(/[^a-z0-9\s]/i, '').split(' ').inject('') {|a, e| a << "body:#{e}" if e != 'body'}}
    # end
  end
end
