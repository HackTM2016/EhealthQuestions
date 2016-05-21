class ProxyController < ApplicationController
  rescue_from Exception do |exception|
    Rails.logger.info(exception)
    puts exception
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
    query ||= params.select{|k,_| k.to_sym == :q}
    Faraday.get("http://hacktm.ness.ro:8983/solr/article/select", {wt: :json, q: query})
  rescue
    MultiJson.load(open('test/index.json'))
  end
end
