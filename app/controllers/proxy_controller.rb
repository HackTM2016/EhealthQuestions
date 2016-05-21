class ProxyController < ApplicationController
  def index
    response.headers['Access-Control-Allow-Origin'] = '*'
    render :json => (get_articles rescue MultiJson.load(open('test/index.json')))
  end

  def get_articles(query = nil)
    query ||= params.select{|k,_| k.to_sym == :q}
    Faraday.get("http://hacktm.ness.ro:8983/solr/article/select", {wt: :json, q: query})
  end
end
